import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import { SdsInputDirective, SdsTextareaDirective } from '../shared/spartan/sds-form';
import { SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import { SdsToastService } from '../shared/toast/sds-toast.service';

type Method = 'ai' | 'upload' | 'manual';
type Step = 'select' | 'thinking' | 'editor';

interface PackagedFile {
  path: string;
  group: 'Reference' | 'Schema';
  content: string;
}

interface BrandColor {
  name: string;
  hex: string;
}

const AI_CHIPS = ['Client adoption analyzer', 'Employee onboarding tracker', 'Performance review scheduler'];

const THINKING_LABELS = [
  'Understanding the skill, context and business purpose',
  'Designing the instruction flow',
  'Selecting the right references and tools',
  'Assembling the SKILL.md package',
];

const AMPLIFY_JSON = `{
  "apis": [
    {
      "name": "Employee API",
      "endpoint": "/api/v1/employee",
      "methods": ["GET", "POST", "PUT", "DELETE"],
      "description": "Manages employee data and operations"
    },
    {
      "name": "Attendance API",
      "endpoint": "/api/v1/attendance",
      "methods": ["GET", "POST"],
      "description": "Handles attendance tracking and reporting"
    },
    {
      "name": "Leave Management API",
      "endpoint": "/api/v1/leave",
      "methods": ["GET", "POST", "PUT"],
      "description": "Manages leave requests and approvals"
    }
  ]
}`;

const INSTRUCTIONS = `# Adoption Agent — Operating Instructions

You are a product adoption agent for Darwinbox. Your job is to help CSMs and KAMs understand how well their clients are using Darwinbox modules.

## Step 1 — Validate inputs
Check that the query mentions a client or module name.

## Step 2 — Fetch data
Use the references to get adoption metrics.

## Step 3 — Analyze and respond
Provide clear recommendations with actionable insights.`;

const BRAND_JSON = `{
  "profile_id": "399966a2-5bf3-4a20-be6a-900870423ad7",
  "name": "jhhhvm",
  "created_from": {
    "DBX ppt template_small.pptx": ""
  },
  "version": "1.0",
  "created_at": "2026-05-13T14:55:24.162790Z",
  "colors": {
    "scheme_name": "DarwinBox",
    "primary": "#1676E2",
    "primary_light": "#E7E6E6",
    "secondary": "#085996",
    "background_dark": "#1676E2",
    "background_light": "#FFFFFF",
    "text_dark": "#000000",
    "text_light": "#FFFFFF"
  }
}`;

@Component({
  selector: 'app-skill-new',
  standalone: true,
  imports: [
    CommonModule,
    SdsAppTopbarComponent,
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsInputDirective,
    SdsTextareaDirective,
    SdsSearchFieldDirective,
  ],
  templateUrl: './skill-new.component.html',
  styleUrl: './skill-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillNewComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly toast = inject(SdsToastService);

  readonly globalSearch = signal('');
  readonly aiChips = AI_CHIPS;

  readonly step = signal<Step>('select');
  readonly method = signal<Method>('ai');
  readonly uploadMode = signal<'md' | 'pptx'>('md');
  readonly prompt = signal('');

  // Thinking animation.
  readonly thinkingProgress = signal(0);
  readonly thinkingLabel = signal(THINKING_LABELS[0]);

  // Editor.
  readonly skillName = signal('');
  readonly displayName = signal('');
  readonly slug = signal('');
  readonly description = signal('');
  readonly category = signal('');
  readonly tags = signal<string[]>([]);
  readonly instructions = signal('');
  readonly files = signal<PackagedFile[]>([]);
  readonly activeFilePath = signal<string | null>(null);
  readonly fileEnabled = signal(true);

  // Brand profile (from PPTX).
  readonly brandColors = signal<BrandColor[]>([]);
  readonly brandJson = signal('');
  readonly brandDefault = signal(false);

  // AI Assist copilot.
  readonly aiAssistOpen = signal(false);
  readonly assistInput = signal('');

  readonly canGenerate = computed(() => this.prompt().trim().length > 0);
  readonly referenceFiles = computed(() => this.files().filter((f) => f.group === 'Reference'));
  readonly schemaFiles = computed(() => this.files().filter((f) => f.group === 'Schema'));
  readonly activeFile = computed(() => this.files().find((f) => f.path === this.activeFilePath()) ?? null);
  readonly hasBrand = computed(() => this.brandColors().length > 0);

  // ── Method selection ──
  selectMethod(m: Method): void {
    this.method.set(m);
    if (m === 'manual') {
      this.openEditor(false, true);
    }
  }

  goBack(): void {
    if (this.step() === 'editor') {
      this.step.set('select');
      return;
    }
    this.location.back();
  }

  cancel(): void {
    void this.router.navigate(['/agent-resources/skill-registry']);
  }

  useChip(chip: string): void {
    this.prompt.set(`Create a skill: ${chip} for Darwinbox modules.`);
  }

  // ── Generate with AI ──
  generate(): void {
    if (!this.canGenerate()) return;
    this.runThinking(() => this.openEditor(false));
  }

  private runThinking(done: () => void): void {
    this.step.set('thinking');
    this.thinkingProgress.set(0);
    this.thinkingLabel.set(THINKING_LABELS[0]);
    const tick = setInterval(() => {
      this.thinkingProgress.update((p) => Math.min(100, p + 6 + Math.random() * 9));
      const p = this.thinkingProgress();
      const idx = Math.min(THINKING_LABELS.length - 1, Math.floor((p / 100) * THINKING_LABELS.length));
      this.thinkingLabel.set(THINKING_LABELS[idx]);
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(done, 250);
      }
    }, 200);
  }

  // ── Upload ──
  onSkillFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = (input.files ?? [])[0];
    input.value = '';
    if (!file) return;
    if (this.uploadMode() === 'pptx') {
      this.runThinking(() => this.openEditor(true));
    } else {
      this.openEditor(false);
    }
  }

  // ── Editor ──
  private openEditor(withBrand: boolean, empty = false): void {
    if (empty) {
      this.skillName.set('New Skill');
      this.displayName.set('');
      this.slug.set('');
      this.description.set('');
      this.category.set('');
      this.tags.set([]);
      this.instructions.set('');
      this.files.set([]);
      this.activeFilePath.set(null);
      this.brandColors.set([]);
    } else {
      this.skillName.set('Adoption Agent');
      this.displayName.set('Adoption Agent');
      this.slug.set('Adoption Agent-skill');
      this.description.set('Darwinbox product adoption agent. Use this skill whenever a user asks about client adoption levels, module usage, adoption metrics, RAG status…');
      this.category.set('Analytics & Reporting');
      this.tags.set(['Adoption', 'Analytics']);
      this.instructions.set(INSTRUCTIONS);
      this.files.set([
        { path: 'reference/amplify_apis.json', group: 'Reference', content: AMPLIFY_JSON },
        { path: 'reference/api-repository.json', group: 'Reference', content: '{ "repository": "..." }' },
        { path: 'reference/approach-selection.md', group: 'Reference', content: '# Approach selection\\n...' },
        { path: 'reference/transaction-patterns.json', group: 'Schema', content: '{ "patterns": [] }' },
        { path: 'reference/validation_patterns.json', group: 'Schema', content: '{ "validation": [] }' },
      ]);
      this.activeFilePath.set('reference/amplify_apis.json');
    }

    if (withBrand) {
      this.brandColors.set([
        { name: 'primary', hex: '#1676E2' },
        { name: 'primary_light', hex: '#E7E6E6' },
        { name: 'secondary', hex: '#085996' },
        { name: 'primary', hex: '#ffffff' },
        { name: 'primary', hex: '#000000' },
      ]);
      this.brandJson.set(BRAND_JSON);
    }

    if (this.method() === 'ai') {
      this.aiAssistOpen.set(true);
    }
    this.step.set('editor');
  }

  selectFile(path: string): void {
    this.activeFilePath.set(path);
  }

  removeTag(tag: string): void {
    this.tags.update((list) => list.filter((t) => t !== tag));
  }

  toggleAiAssist(): void {
    this.aiAssistOpen.update((v) => !v);
  }

  save(): void {
    this.toast.show(`${this.displayName() || 'Skill'} created successfully.`, 'success');
    void this.router.navigate(['/agent-resources/skill-registry']);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.aiAssistOpen()) this.aiAssistOpen.set(false);
  }
}
