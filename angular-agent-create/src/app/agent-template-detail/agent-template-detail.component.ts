import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { findAgentTemplate } from '../core/agent-template-data';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent } from '../shared/spartan/sds-button';
import { SdsCardDirective } from '../shared/spartan/sds-form';
import { SdsResourceCardDirective } from '../shared/spartan/sds-layout';

interface DetailField {
  label: string;
  value: string;
}

interface RegistryItem {
  title: string;
  description: string;
  tag: string;
}

@Component({
  selector: 'app-agent-template-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SdsAppTopbarComponent, SdsIconComponent, SdsButtonComponent, SdsCardDirective, SdsResourceCardDirective],
  templateUrl: './agent-template-detail.component.html',
  styleUrl: './agent-template-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentTemplateDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly template = findAgentTemplate(this.route.snapshot.paramMap.get('templateId'));
  readonly source = this.route.snapshot.queryParamMap.get('source');
  readonly displayName = this.route.snapshot.queryParamMap.get('name') ?? this.template.name;
  readonly ctaLabel = this.source === 'existing' ? 'Duplicate' : 'Use Template';
  readonly ctaQueryParams = {
    template: this.template.id,
    source: this.source ?? 'template',
    name: this.displayName,
  };
  readonly projectName = this.template.category.includes('Payroll') ? 'Payroll Agent' : 'Adoption Agent';
  readonly systemPrompt = `# Darwinbox ${this.displayName} - System Prompt
You are the Darwinbox ${this.displayName}. You help CSMs and KAMs understand how well their clients are adopting Darwinbox modules, surface adoption risks, and recommend specific actions to improve outcomes.`;

  readonly modelFields: DetailField[] = [
    { label: 'Provider', value: 'ChatGPT' },
    { label: 'Model', value: 'GPT 5.4 Extended Thinking' },
    { label: 'Key Profile', value: 'Pranav kumar' },
    { label: 'Temperature', value: '0.7 (Balanced)' },
    { label: 'Max Output Tokens', value: '6500' },
    { label: 'Reasoning Mode', value: 'Not Enabled.' },
  ];

  readonly tools: RegistryItem[] = [
    {
      title: 'Production Adoption',
      description: 'Use this tool to generate flow diagrams in png format from the mermaid code',
      tag: 'Code Block',
    },
    {
      title: 'Production Adoption',
      description: 'Use this tool to generate flow diagrams in png format from the mermaid code',
      tag: 'API',
    },
    {
      title: 'Production Adoption',
      description: 'Use this tool to generate flow diagrams in png format from the mermaid code',
      tag: 'Connectors',
    },
  ];

  readonly knowledgeBases: RegistryItem[] = [
    {
      title: 'AITECH-1479 - Resume Parser - V3',
      description: '6 tokens2 chunksMay 19, 20:06',
      tag: 'Embedded',
    },
    {
      title: 'AITECH-1479 - Resume Parser - V3',
      description: '6 tokens2 chunksMay 19, 20:06',
      tag: 'Embedded',
    },
  ];

  readonly capabilities: DetailField[] = [
    { label: 'Code Executor', value: 'Enabled' },
    { label: 'Document generator (PDF & Word)', value: 'Not Enabled' },
    { label: 'Slides (PowerPoint)', value: 'Enabled' },
  ];
}
