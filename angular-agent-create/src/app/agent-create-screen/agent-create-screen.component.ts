import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentApiService } from '../core/agent-api.service';
import { AgentStatus } from '../core/agent-api.types';
import { findAgentTemplate, TemplateCard } from '../core/agent-template-data';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import {
  SdsCatalogCategory,
  SdsCatalogItem,
  SdsCatalogKind,
  SdsCatalogPickerDialogComponent,
  SdsCatalogSelectionEvent,
} from '../shared/catalog-picker/sds-catalog-picker.component';
import { SdsSelectedResourceCardComponent } from '../shared/resource-card/sds-selected-resource-card.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import {
  SdsCardDirective,
  SdsCardHeaderDirective,
  SdsCardTitleDirective,
  SdsFieldDirective,
  SdsFieldGridDirective,
  SdsFormSectionDirective,
  SdsInputDirective,
  SdsSectionHeaderDirective,
  SdsTextareaDirective,
} from '../shared/spartan/sds-form';
import {
  SdsSelectContentComponent,
  SdsSelectDirective,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';
import { HlmSidebarContent } from '../shared/ui/sidebar/src/lib/hlm-sidebar-content';
import { HlmSidebarGroup } from '../shared/ui/sidebar/src/lib/hlm-sidebar-group';
import { HlmSidebarGroupContent } from '../shared/ui/sidebar/src/lib/hlm-sidebar-group-content';
import { HlmSidebarMenu } from '../shared/ui/sidebar/src/lib/hlm-sidebar-menu';
import { HlmSidebarMenuButton } from '../shared/ui/sidebar/src/lib/hlm-sidebar-menu-button';
import { HlmSidebarMenuItem } from '../shared/ui/sidebar/src/lib/hlm-sidebar-menu-item';
import { HlmSidebarMenuSub } from '../shared/ui/sidebar/src/lib/hlm-sidebar-menu-sub';
import { HlmSidebarMenuSubButton } from '../shared/ui/sidebar/src/lib/hlm-sidebar-menu-sub-button';
import { HlmSidebarMenuSubItem } from '../shared/ui/sidebar/src/lib/hlm-sidebar-menu-sub-item';
import { SdsToastService } from '../shared/toast/sds-toast.service';
import { AgentCopilotPanelComponent } from './agent-copilot-panel.component';

interface ConfigNavItem {
  label: 'Overview' | 'Model' | 'Tools & Data' | 'Skills';
  id: 'overview' | 'model' | 'tools-and-data' | 'skills';
  icon: 'circle-check' | 'sparkles' | 'wrench' | 'target';
}

interface CapabilityItem {
  id: 'codeExecutor' | 'documentGenerator' | 'slidesGenerator';
  title: string;
  description: string;
  chips: string[];
  enabled: boolean;
}

interface InitialAgentFormValue {
  name: string;
  project: string;
  description: string;
  agentInstructions: string;
  provider: string;
  model: string;
  keyProfile: string;
  temperature: string;
  maxOutputTokens: string;
  kbRetrievalTopK: string;
  extendedReasoning: boolean;
}

type CatalogType = SdsCatalogKind;
type WorkspaceMode = 'manual' | 'copilot';
type SaveIntent = 'create' | 'draft' | 'activate';

@Component({
  selector: 'app-agent-create-screen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SdsAppTopbarComponent,
    SdsIconComponent,
    AgentCopilotPanelComponent,
    SdsSelectDirective,
    SdsSelectTriggerComponent,
    SdsSelectContentComponent,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    HlmSidebarContent,
    HlmSidebarGroup,
    HlmSidebarGroupContent,
    HlmSidebarMenu,
    HlmSidebarMenuButton,
    HlmSidebarMenuItem,
    HlmSidebarMenuSub,
    HlmSidebarMenuSubButton,
    HlmSidebarMenuSubItem,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsCardDirective,
    SdsCardHeaderDirective,
    SdsCardTitleDirective,
    SdsFormSectionDirective,
    SdsSectionHeaderDirective,
    SdsFieldGridDirective,
    SdsFieldDirective,
    SdsInputDirective,
    SdsTextareaDirective,
    SdsCatalogPickerDialogComponent,
    SdsSelectedResourceCardComponent,
  ],
  templateUrl: './agent-create-screen.component.html',
  styleUrls: ['./agent-create-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCreateScreenComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly agentApi = inject(AgentApiService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly toastService = inject(SdsToastService);
  private scrollFrame: number | null = null;

  private readonly templateId = this.route.snapshot.queryParamMap.get('template');
  private readonly source = this.route.snapshot.queryParamMap.get('source');
  private readonly queryName = this.route.snapshot.queryParamMap.get('name');
  private readonly template: TemplateCard | null = this.templateId ? findAgentTemplate(this.templateId) : null;
  private readonly initialValue = this.buildInitialValue();

  readonly status = signal<AgentStatus>('Draft');
  readonly actionMenuOpen = signal(false);
  readonly activeCatalog = signal<CatalogType | null>(null);
  readonly workspaceMode = signal<WorkspaceMode>('manual');
  readonly lastSavedLabel = signal('Not yet saved');
  readonly selectedTriggers = signal<string[]>(['Super Agent', 'Web']);
  readonly selectedToolIds = signal<string[]>([]);
  readonly selectedKnowledgeBaseIds = signal<string[]>([]);
  readonly selectedSkillIds = signal<string[]>([]);
  readonly triggerDropdownOpen = signal(false);
  readonly activeConfigSection = signal<ConfigNavItem['id']>('overview');
  readonly savedAgentId = signal<string | null>(null);

  readonly configNavItems: ConfigNavItem[] = [
    { label: 'Overview', id: 'overview', icon: 'circle-check' },
    { label: 'Model', id: 'model', icon: 'sparkles' },
    { label: 'Tools & Data', id: 'tools-and-data', icon: 'wrench' },
    { label: 'Skills', id: 'skills', icon: 'target' },
  ];

  readonly triggerOptions = ['Super Agent', 'Web', 'Agent Node in Flows'];
  readonly projectOptions = ['New Agents', 'Onboarding', 'Talent Acquisition', 'Employee Experience', 'Payroll Transformation'];
  readonly providerOptions = ['ChatGPT', 'Anthropic', 'Google Gemini', 'Mistral'];
  readonly modelOptions: Record<string, string[]> = {
    ChatGPT: ['GPT 5.4 Extended Thinking', 'GPT 4.1', 'GPT 4o'],
    Anthropic: ['Claude Sonnet 4.5', 'Claude Opus 4.1'],
    'Google Gemini': ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'],
    Mistral: ['Mistral Large', 'Codestral'],
  };
  readonly keyProfiles = ['Pranav kumar', 'HR automation key', 'Talent ops key', 'Finance operations key'];
  readonly kbTopKOptions = ['K3- Higher Context, Medium Precision', 'K5- Balanced Recall', 'K8- Broad Retrieval'];

  readonly toolCategories: SdsCatalogCategory[] = [
    { id: 'all', label: 'All Tools', icon: 'circle-check' },
    { id: 'connectors', label: 'Connectors', icon: 'sparkles' },
    { id: 'api-connections', label: 'API Connections', icon: 'wrench' },
    { id: 'code-block', label: 'Code Block', icon: 'target' },
    { id: 'sub-agent', label: 'Sub Agent', icon: 'target' },
    { id: 'mcp-server', label: 'MCP Server', icon: 'brain-circuit' },
  ];

  readonly toolItems: SdsCatalogItem[] = [
    {
      id: 'db-mcp',
      title: 'DB MCP',
      description: 'Fetches data from the Darwinbox platform for HRMS and human resources data.',
      badge: 'MCP Server',
      categoryId: 'mcp-server',
    },
    {
      id: 'generate-flow-diagram',
      title: 'Generate Flow Diagram',
      description: 'Use this tool to generate flow diagrams in PNG format from Mermaid code.',
      badge: 'Connectors',
      categoryId: 'connectors',
    },
    {
      id: 'production-adoption',
      title: 'Production Adoption',
      description: 'Use this tool to generate flow diagrams in PNG format from Mermaid code.',
      badge: 'Connectors',
      categoryId: 'connectors',
    },
    {
      id: 'onboarding-agent-tool',
      title: 'Onboarding Agent',
      description: 'Use this tool to trigger onboarding workflows and connected HR actions.',
      badge: 'Connectors',
      categoryId: 'connectors',
    },
  ];

  readonly knowledgeBaseCategories: SdsCatalogCategory[] = [
    { id: 'deal-assurance', label: 'Deal Assurance', icon: 'check', meta: '11 Docs . 2K Chunks . 2 Connectors' },
    { id: 'connectors', label: 'Connectors', icon: 'layout-template' },
    { id: 'api-connections', label: 'API Connections', icon: 'layout-template' },
    { id: 'code-block', label: 'Code Block', icon: 'layout-template' },
    { id: 'sub-agent', label: 'Sub Agent', icon: 'layout-template' },
    { id: 'mcp-server', label: 'MCP Server', icon: 'layout-template' },
  ];

  readonly knowledgeBaseItems: SdsCatalogItem[] = [
    {
      id: 'kb-db-mcp',
      title: 'DB MCP',
      description: 'Fetches data from the Darwinbox platform for HRMS and human resources data.',
      badge: 'MCP Server',
      categoryId: 'deal-assurance',
      group: 'Connectors',
    },
    {
      id: 'kb-generate-flow-diagram',
      title: 'Generate Flow Diagram',
      description: 'Use this tool to generate flow diagrams in PNG format from Mermaid code.',
      badge: 'Connectors',
      categoryId: 'deal-assurance',
      group: 'Connectors',
    },
    {
      id: 'aitech-resume-parser-v3',
      title: 'AITECH-1479 - Resume Parser - V3',
      description: 'Resume parsing document for candidate intake and onboarding review.',
      badge: 'Embedded',
      metadata: '6 tokens2 chunksMay 19, 20:06',
      categoryId: 'deal-assurance',
      group: 'Documents',
    },
    {
      id: 'ai-notetaker-analyser-draft',
      title: 'AI Notetaker and Analyser (Draft)',
      description: 'Draft notes and analysis document for meeting summaries and HR review.',
      badge: 'Embedded',
      metadata: '6 tokens2 chunksMay 19, 20:06',
      categoryId: 'deal-assurance',
      group: 'Documents',
    },
  ];

  readonly skillItems: SdsCatalogItem[] = [
    {
      id: 'amplify-brd-generator',
      title: 'Amplify BRD Generator',
      description: 'Draft Darwinbox Amplify BRDs through a clarification-first discovery workflow grounded in supported modules and event data structures.',
    },
    {
      id: 'assign-key-people',
      title: 'Assign Key People',
      description: 'Assigns or removes key people such as manager, buddy, recruiter, and onboarding SPOC for onboarding candidates.',
    },
    {
      id: 'darwinbox-cortex',
      title: 'Darwinbox Cortex',
      description: 'Internal knowledge library for dbcontextgraph with verified entity files across clusters and modules.',
    },
    {
      id: 'darwinbox-cortex-advisor',
      title: 'Darwinbox Cortex Advisor',
      description: 'Darwinbox configuration advisor that turns HR requirements into complete and actionable workflow guidance.',
    },
  ];

  readonly selectedTools = computed(() => this.findCatalogItems(this.toolItems, this.selectedToolIds()));
  readonly selectedKnowledgeBases = computed(() => this.findCatalogItems(this.knowledgeBaseItems, this.selectedKnowledgeBaseIds()));
  readonly selectedSkills = computed(() => this.findCatalogItems(this.skillItems, this.selectedSkillIds()));

  readonly capabilities = signal<CapabilityItem[]>([
    {
      id: 'codeExecutor',
      title: 'Code Executor',
      description: 'Run Python and JavaScript code in a secure subprocess for calculations, data processing, and logic.',
      chips: ['codeexec_python', 'codeexec_javascript', 'codeexec_pythonscript'],
      enabled: false,
    },
    {
      id: 'documentGenerator',
      title: 'Document generator (PDF & Word)',
      description: 'Generate PDF or Word documents and return a downloadable link in chat.',
      chips: ['create_pdf', 'create_word'],
      enabled: false,
    },
    {
      id: 'slidesGenerator',
      title: 'Slides (PowerPoint)',
      description: 'Generate polished PowerPoint or PDF presentations from a prompt.',
      chips: ['create_slides'],
      enabled: false,
    },
  ]);

  readonly agentForm = new FormGroup({
    name: new FormControl(this.initialValue.name, { nonNullable: true }),
    project: new FormControl(this.initialValue.project, { nonNullable: true }),
    description: new FormControl(this.initialValue.description, { nonNullable: true }),
    agentInstructions: new FormControl(this.initialValue.agentInstructions, { nonNullable: true }),
    provider: new FormControl(this.initialValue.provider, { nonNullable: true }),
    model: new FormControl(this.initialValue.model, { nonNullable: true }),
    keyProfile: new FormControl(this.initialValue.keyProfile, { nonNullable: true }),
    temperature: new FormControl(this.initialValue.temperature, { nonNullable: true }),
    maxOutputTokens: new FormControl(this.initialValue.maxOutputTokens, { nonNullable: true }),
    kbRetrievalTopK: new FormControl(this.initialValue.kbRetrievalTopK, { nonNullable: true }),
    extendedReasoning: new FormControl(this.initialValue.extendedReasoning, { nonNullable: true }),
  });

  get currentModelOptions(): string[] {
    return this.modelOptions[this.agentForm.controls.provider.value] ?? this.modelOptions['ChatGPT'];
  }

  get displayName(): string {
    return this.agentForm.controls.name.value.trim() || 'Untitled Agent';
  }

  get sourceLabel(): string {
    if (this.source === 'existing') {
      return 'Duplicate';
    }
    if (this.template) {
      return 'Template';
    }
    return 'Manual';
  }

  get temperatureLabel(): string {
    const temperature = Number(this.agentForm.controls.temperature.value);
    if (temperature < 0.4) {
      return 'Precise';
    }
    if (temperature > 1.3) {
      return 'Creative';
    }
    return 'Balanced';
  }

  toggleActionMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.triggerDropdownOpen.set(false);
    this.actionMenuOpen.update((current) => !current);
  }

  saveAgent(status: AgentStatus, event?: MouseEvent, intent: SaveIntent = status === 'Active' ? 'activate' : 'create'): void {
    event?.stopPropagation();
    const formValue = this.agentForm.getRawValue();
    const name = formValue.name.trim() || 'Untitled Agent';
    const description = formValue.description.trim() || 'Agent configuration saved from manual setup.';
    const category = formValue.project || this.template?.category || 'New Agents';

    this.agentApi
      .createAgent({
        name,
        description,
        category,
        projectName: formValue.project,
        status,
        systemPrompt: formValue.agentInstructions,
        configuration: {
          source: this.sourceLabel,
          triggers: this.selectedTriggers(),
          model: {
            provider: formValue.provider,
            model: formValue.model,
            keyProfile: formValue.keyProfile,
            temperature: formValue.temperature,
            maxOutputTokens: formValue.maxOutputTokens,
            kbRetrievalTopK: formValue.kbRetrievalTopK,
            extendedReasoning: formValue.extendedReasoning,
          },
          capabilities: this.capabilities(),
          resources: {
            tools: this.selectedTools(),
            knowledgeBases: this.selectedKnowledgeBases(),
            skills: this.selectedSkills(),
          },
        },
      })
      .subscribe((agent) => {
        this.savedAgentId.set(agent.id);
        this.status.set(agent.status);
        this.lastSavedLabel.set(agent.status === 'Active' ? 'Created and activated' : 'Saved as draft');
        this.actionMenuOpen.set(false);
        this.toastService.show(this.getSaveToastMessage(intent), 'success');
        void this.router.navigate(['/agent-creation'], {
          queryParams: {
            highlightAgentId: agent.id,
          },
        });
      });
  }

  onProviderChange(provider: string): void {
    this.agentForm.controls.provider.setValue(provider);
    const models = this.modelOptions[provider] ?? this.modelOptions['ChatGPT'];
    if (!models.includes(this.agentForm.controls.model.value)) {
      this.agentForm.controls.model.setValue(models[0]);
    }
  }

  onProjectChange(project: string): void {
    this.agentForm.controls.project.setValue(project);
  }

  onModelChange(model: string): void {
    this.agentForm.controls.model.setValue(model);
  }

  onKeyProfileChange(profile: string): void {
    this.agentForm.controls.keyProfile.setValue(profile);
  }

  onKbTopKChange(option: string): void {
    this.agentForm.controls.kbRetrievalTopK.setValue(option);
  }

  onTemperatureInput(value: string): void {
    this.agentForm.controls.temperature.setValue(value);
  }

  toggleTriggerDropdown(event: Event): void {
    event.stopPropagation();
    this.actionMenuOpen.set(false);
    this.triggerDropdownOpen.update((current) => !current);
  }

  selectTrigger(option: string, event: Event): void {
    event.stopPropagation();
    this.selectedTriggers.update((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  }

  removeTrigger(option: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedTriggers.update((current) => current.filter((item) => item !== option));
  }

  toggleCapability(capabilityId: CapabilityItem['id']): void {
    this.capabilities.update((items) =>
      items.map((item) => (item.id === capabilityId ? { ...item, enabled: !item.enabled } : item)),
    );
  }

  openCatalog(type: CatalogType): void {
    this.activeCatalog.set(type);
  }

  closeCatalog(): void {
    this.activeCatalog.set(null);
  }

  setWorkspaceMode(mode: WorkspaceMode): void {
    this.workspaceMode.set(mode);
  }

  catalogTitle(type: CatalogType): string {
    const titles: Record<CatalogType, string> = {
      tools: 'Add Tool',
      knowledgeBases: 'Add Knowledge Base',
      skills: 'Add Skills',
    };
    return titles[type];
  }

  catalogConfirmLabel(type: CatalogType): string {
    const labels: Record<CatalogType, string> = {
      tools: 'Add Tool',
      knowledgeBases: 'Add Knowledge Base',
      skills: 'Add Skill',
    };
    return labels[type];
  }

  catalogManageLabel(type: CatalogType): string {
    const labels: Record<CatalogType, string> = {
      tools: 'Manage Tools',
      knowledgeBases: 'Manage Knowledge Base',
      skills: 'Manage Skills',
    };
    return labels[type];
  }

  catalogItems(type: CatalogType): SdsCatalogItem[] {
    const items: Record<CatalogType, SdsCatalogItem[]> = {
      tools: this.toolItems,
      knowledgeBases: this.knowledgeBaseItems,
      skills: this.skillItems,
    };
    return items[type];
  }

  catalogCategories(type: CatalogType): SdsCatalogCategory[] {
    const categories: Record<CatalogType, SdsCatalogCategory[]> = {
      tools: this.toolCategories,
      knowledgeBases: this.knowledgeBaseCategories,
      skills: [],
    };
    return categories[type];
  }

  catalogSelectedIds(type: CatalogType): string[] {
    const selectedIds: Record<CatalogType, string[]> = {
      tools: this.selectedToolIds(),
      knowledgeBases: this.selectedKnowledgeBaseIds(),
      skills: this.selectedSkillIds(),
    };
    return selectedIds[type];
  }

  commitCatalogSelection(event: SdsCatalogSelectionEvent): void {
    this.setCatalogSelection(event.kind, event.ids);
    this.closeCatalog();
  }

  removeSelectedResource(type: CatalogType, itemId: string): void {
    const selectedIds = this.catalogSelectedIds(type).filter((id) => id !== itemId);
    this.setCatalogSelection(type, selectedIds);
  }

  scrollToSectionById(sectionId: string): void {
    const item = this.configNavItems.find((navItem) => navItem.id === sectionId);

    if (!item) {
      return;
    }

    this.scrollToSection(item);
  }

  scrollToSection(item: ConfigNavItem, event?: Event): void {
    event?.preventDefault();
    const container = this.elementRef.nativeElement.querySelector<HTMLElement>('.form-scroll');
    const section = this.elementRef.nativeElement.querySelector<HTMLElement>(`#${item.id}`);

    if (!container || !section) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const targetTop = container.scrollTop + sectionRect.top - containerRect.top;
    container.scrollTo({ top: targetTop, behavior: 'smooth' });
    this.activeConfigSection.set(item.id);
  }

  onFormScroll(event: Event): void {
    const container = event.currentTarget as HTMLElement | null;

    if (!container) {
      return;
    }

    if (this.scrollFrame !== null) {
      cancelAnimationFrame(this.scrollFrame);
    }

    this.scrollFrame = requestAnimationFrame(() => {
      this.updateActiveConfigSection(container);
      this.scrollFrame = null;
    });
  }

  private updateActiveConfigSection(container: HTMLElement): void {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 8) {
      this.setActiveConfigSection('skills');
      return;
    }

    const thresholdTop = container.getBoundingClientRect().top + 80;
    const activeItem =
      this.configNavItems
        .map((item) => ({
          item,
          top: this.elementRef.nativeElement.querySelector<HTMLElement>(`#${item.id}`)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
        }))
        .filter(({ top }) => top <= thresholdTop)
        .at(-1)?.item ?? this.configNavItems[0];

    this.setActiveConfigSection(activeItem.id);
  }

  private setActiveConfigSection(sectionId: ConfigNavItem['id']): void {
    if (this.activeConfigSection() === sectionId) {
      return;
    }

    this.activeConfigSection.set(sectionId);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.actionMenuOpen.set(false);
    this.triggerDropdownOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.actionMenuOpen.set(false);
    this.triggerDropdownOpen.set(false);
    this.closeCatalog();
  }

  trackByValue(index: number, value: string): string {
    return `${index}-${value}`;
  }

  trackCapability(index: number, capability: CapabilityItem): string {
    return `${index}-${capability.id}`;
  }

  trackItem(index: number, item: SdsCatalogItem): string {
    return `${index}-${item.id}`;
  }

  trackNav(index: number, item: ConfigNavItem): string {
    return `${index}-${item.id}`;
  }

  private setCatalogSelection(type: CatalogType, ids: string[]): void {
    if (type === 'tools') {
      this.selectedToolIds.set(ids);
      return;
    }

    if (type === 'knowledgeBases') {
      this.selectedKnowledgeBaseIds.set(ids);
      return;
    }

    this.selectedSkillIds.set(ids);
  }

  private findCatalogItems(items: readonly SdsCatalogItem[], selectedIds: readonly string[]): SdsCatalogItem[] {
    const selectedIdSet = new Set(selectedIds);
    return items.filter((item) => selectedIdSet.has(item.id));
  }

  private getSaveToastMessage(intent: SaveIntent): string {
    if (intent === 'activate') {
      return 'Agent created and activated';
    }

    if (intent === 'draft') {
      return 'Draft saved';
    }

    return 'Agent created';
  }

  private buildInitialValue(): InitialAgentFormValue {
    const templateName = this.queryName ?? this.template?.name ?? '';
    const project = this.template?.category ?? 'New Agents';
    const description = this.template?.description ?? '';
    const name = this.source === 'existing' && templateName ? templateName : templateName;

    return {
      name,
      project,
      description,
      agentInstructions: this.template
        ? `You are a ${templateName} for Darwinbox. Use connected tools, approved knowledge sources, and reusable skills to complete the user request with clear next steps.`
        : 'You are a Darwinbox agent. Help users complete HR tasks with clear steps and use connected tools before giving final answers.',
      provider: 'ChatGPT',
      model: 'GPT 5.4 Extended Thinking',
      keyProfile: 'Pranav kumar',
      temperature: '0.7',
      maxOutputTokens: '4096',
      kbRetrievalTopK: 'K3- Higher Context, Medium Precision',
      extendedReasoning: false,
    };
  }
}
