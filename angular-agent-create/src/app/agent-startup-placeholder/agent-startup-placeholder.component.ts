import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AGENT_TEMPLATES, TemplateCard } from '../core/agent-template-data';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent } from '../shared/spartan/sds-button';
import { SdsCardDirective } from '../shared/spartan/sds-form';
import { SdsSearchFieldDirective } from '../shared/spartan/sds-layout';
import {
  SdsSelectContentComponent,
  SdsSelectDirective,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';

interface AiSuggestion {
  id: string;
  label: string;
  type: 'existing' | 'template';
  context: string;
  icon: 'bot' | 'layout-template';
}

interface AiSuggestionGroups {
  existing: AiSuggestion[];
  templates: AiSuggestion[];
}

const CONTEXT_KEYWORDS = [
  'attendance',
  'benefit',
  'buddy',
  'candidate',
  'coach',
  'compliance',
  'engage',
  'employee',
  'feedback',
  'hire',
  'hiring',
  'knowledge',
  'leave',
  'manager',
  'mobility',
  'onboard',
  'payroll',
  'performance',
  'policy',
  'recruit',
  'review',
  'skill',
  'survey',
  'talent',
  'training',
  'workforce',
];

function normalizeSearchValue(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function getPromptTokens(prompt: string): string[] {
  return normalizeSearchValue(prompt)
    .split(' ')
    .filter((token) => token.length > 2);
}

function tokenMatches(searchable: string, token: string): boolean {
  return searchable.includes(token) || CONTEXT_KEYWORDS.some((keyword) => keyword.includes(token) && searchable.includes(keyword));
}

function scoreSuggestion(prompt: string, suggestion: AiSuggestion): number {
  const normalizedPrompt = normalizeSearchValue(prompt);
  const searchable = normalizeSearchValue(`${suggestion.label} ${suggestion.context}`);
  const tokens = getPromptTokens(prompt);
  const tokenScore = tokens.reduce((score, token) => score + (tokenMatches(searchable, token) ? 2 : 0), 0);
  const phraseScore = searchable.includes(normalizedPrompt) ? 5 : 0;
  const onboardingScore = normalizedPrompt.includes('onboard') && searchable.includes('onboard') ? 4 : 0;

  return tokenScore + phraseScore + onboardingScore;
}

function hasContextualSignal(prompt: string): boolean {
  const tokens = getPromptTokens(prompt);

  return tokens.some((token) => CONTEXT_KEYWORDS.some((keyword) => keyword.includes(token) || token.includes(keyword)));
}

@Component({
  selector: 'app-agent-startup-placeholder',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SdsAppTopbarComponent,
    SdsIconComponent,
    SdsButtonComponent,
    SdsCardDirective,
    SdsSearchFieldDirective,
    SdsSelectContentComponent,
    SdsSelectDirective,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    SdsSelectTriggerComponent,
  ],
  templateUrl: './agent-startup-placeholder.component.html',
  styleUrl: './agent-startup-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentStartupPlaceholderComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly templateSearch = signal('');
  readonly selectedTemplateCategory = signal('All');
  readonly aiPrompt = signal('');
  readonly selectedProject = signal('');
  private readonly dismissedSuggestionPrompt = signal('');

  readonly templates: TemplateCard[] = AGENT_TEMPLATES;
  private readonly existingAgentSuggestions: AiSuggestion[] = [
    {
      id: 'onboarding-experience-agent',
      label: 'Onboarding Agent',
      type: 'existing',
      icon: 'bot',
      context: 'manager buddy recruiter onboarding spoc new candidate employee lifecycle joining',
    },
    {
      id: 'onboarding-experience-agent',
      label: 'Onboarding Agent for Buddy',
      type: 'existing',
      icon: 'bot',
      context: 'buddy manager recruiter onboarding spoc new hire candidate',
    },
    {
      id: 'payroll-compliance-agent',
      label: 'Payroll Compliance Agent',
      type: 'existing',
      icon: 'bot',
      context: 'payroll compliance local labor laws tax regulations risk',
    },
    {
      id: 'employee-engagement-agent',
      label: 'Employee Engagement Agent',
      type: 'existing',
      icon: 'bot',
      context: 'employee engagement survey feedback sentiment culture pulse',
    },
    {
      id: 'employee-engagement-bot',
      label: 'Employee Engagement Bot',
      type: 'existing',
      icon: 'bot',
      context: 'employee engagement bot feedback workplace experience satisfaction',
    },
    {
      id: 'recruitment-analytics-agent',
      label: 'Recruitment Analytics Agent',
      type: 'existing',
      icon: 'bot',
      context: 'hiring recruiter candidates talent acquisition pipeline quality',
    },
    {
      id: 'attendance-management-agent',
      label: 'Attendance Management Agent',
      type: 'existing',
      icon: 'bot',
      context: 'attendance leave absence anomaly workforce policy',
    },
    {
      id: 'performance-review-agent',
      label: 'Performance Review Agent',
      type: 'existing',
      icon: 'bot',
      context: 'performance review feedback continuous development planning',
    },
    {
      id: 'knowledge-retrieval-agent',
      label: 'Knowledge Retrieval Agent',
      type: 'existing',
      icon: 'bot',
      context: 'knowledge policy sop retrieval questions frontline teams',
    },
  ];

  private readonly prebuiltTemplateSuggestions: AiSuggestion[] = this.templates.map((template) => ({
    id: template.id,
    label: template.name,
    type: 'template',
    icon: 'layout-template',
    context: `${template.description} ${template.category}`,
  }));

  readonly projects = [
    'New Agents',
    'HR Operations',
    'Talent Acquisition',
    'Employee Experience',
    'Payroll Transformation',
    'Workforce Planning',
  ];

  readonly templateCategories = computed(() =>
    [...new Set(this.templates.map((template) => template.category))].sort((first, second) =>
      first.localeCompare(second),
    ),
  );

  readonly filteredTemplates = computed(() => {
    const searchTerm = this.templateSearch().trim().toLowerCase();
    const selectedCategory = this.selectedTemplateCategory();

    return this.templates.filter((template) => {
      const matchesSearch =
        !searchTerm ||
        template.name.toLowerCase().includes(searchTerm) ||
        template.description.toLowerCase().includes(searchTerm) ||
        template.category.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  });

  readonly aiBuildReady = computed(() => Boolean(this.aiPrompt().trim() && this.selectedProject()));
  readonly aiSuggestions = computed<AiSuggestionGroups>(() => {
    const prompt = this.aiPrompt();

    if (!this.canSuggestForPrompt(prompt)) {
      return { existing: [], templates: [] };
    }

    return {
      existing: this.rankSuggestions(this.existingAgentSuggestions, prompt, 2),
      templates: this.rankSuggestions(this.prebuiltTemplateSuggestions, prompt, 4),
    };
  });
  readonly showAiSuggestions = computed(() => {
    const normalizedPrompt = normalizeSearchValue(this.aiPrompt());

    if (!normalizedPrompt || normalizedPrompt === this.dismissedSuggestionPrompt()) {
      return false;
    }

    const suggestions = this.aiSuggestions();

    return Boolean(suggestions.existing.length || suggestions.templates.length);
  });

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    const target = event.target as Node | null;
    const aiBuilderForm = this.elementRef.nativeElement.querySelector('.ai-builder-form');

    if (!target || aiBuilderForm?.contains(target)) {
      return;
    }

    this.dismissAiSuggestions();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onDocumentEscape(event: Event): void {
    if (!this.showAiSuggestions()) {
      return;
    }

    event.stopPropagation();
    this.dismissAiSuggestions();
  }

  onTemplateSearchInput(value: string): void {
    this.templateSearch.set(value);
  }

  onTemplateCategoryChange(value: string): void {
    this.selectedTemplateCategory.set(value || 'All');
  }

  onAiPromptInput(value: string): void {
    this.aiPrompt.set(value);
  }

  onProjectChange(value: string): void {
    this.selectedProject.set(value);
  }

  submitAiBuild(event: Event): void {
    event.preventDefault();
  }

  trackTemplate(index: number, template: TemplateCard): string {
    return `${index}-${template.name}`;
  }

  trackSuggestion(index: number, suggestion: AiSuggestion): string {
    return `${suggestion.type}-${suggestion.id}-${index}-${suggestion.label}`;
  }

  private rankSuggestions(source: AiSuggestion[], prompt: string, limit: number): AiSuggestion[] {
    return source
      .map((suggestion, index) => ({ suggestion, index, score: scoreSuggestion(prompt, suggestion) }))
      .filter(({ score }) => score > 0)
      .sort((first, second) => second.score - first.score || first.index - second.index)
      .slice(0, limit)
      .map(({ suggestion }) => suggestion);
  }

  private canSuggestForPrompt(prompt: string): boolean {
    const normalizedPrompt = normalizeSearchValue(prompt);
    const hasEnoughDetail = getPromptTokens(prompt).length > 1 || normalizedPrompt.length >= 8;

    return hasEnoughDetail && hasContextualSignal(prompt);
  }

  private dismissAiSuggestions(): void {
    const normalizedPrompt = normalizeSearchValue(this.aiPrompt());

    if (normalizedPrompt) {
      this.dismissedSuggestionPrompt.set(normalizedPrompt);
    }
  }
}
