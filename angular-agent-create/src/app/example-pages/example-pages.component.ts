import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import { SdsCardDirective } from '../shared/spartan/sds-form';
import {
  SdsBadgeDirective,
  SdsPageDirective,
  SdsPageHeaderDirective,
  SdsPanelDirective,
  SdsResourceCardDirective,
  SdsSearchFieldDirective,
  SdsToolbarDirective,
} from '../shared/spartan/sds-layout';
import {
  SdsSelectContentComponent,
  SdsSelectDirective,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';

interface AgentExampleCard {
  name: string;
  description: string;
  category: string;
  status: 'Active' | 'Draft';
  updated: string;
  dot: 'blue' | 'green' | 'orange' | 'grey';
}

@Component({
  selector: 'app-example-pages',
  standalone: true,
  imports: [
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsCardDirective,
    SdsSelectDirective,
    SdsSelectTriggerComponent,
    SdsSelectContentComponent,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    SdsPageDirective,
    SdsPageHeaderDirective,
    SdsPanelDirective,
    SdsToolbarDirective,
    SdsSearchFieldDirective,
    SdsBadgeDirective,
    SdsResourceCardDirective,
  ],
  templateUrl: './example-pages.component.html',
  styleUrl: './example-pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamplePagesComponent {
  readonly status = signal('All');
  readonly view = signal<'card' | 'list'>('card');
  readonly statusOptions = ['All', 'Active', 'Draft'];

  readonly agents: AgentExampleCard[] = [
    {
      name: 'Product Adoption Agent',
      description: 'Looks at Darwinbox client adoption metrics and gives recommendations.',
      category: 'Integration Automation',
      status: 'Active',
      updated: '2 days ago',
      dot: 'green',
    },
    {
      name: 'Payroll Compliance Agent',
      description: 'Monitors payroll data to ensure compliance with local labor laws.',
      category: 'HR Payroll',
      status: 'Active',
      updated: '5 days ago',
      dot: 'blue',
    },
    {
      name: 'Employee Engagement Agent',
      description: 'Analyzes employee survey feedback to provide engagement insights.',
      category: 'Communication',
      status: 'Draft',
      updated: '2 weeks ago',
      dot: 'grey',
    },
    {
      name: 'Talent Acquisition Agent',
      description: 'Evaluates hiring pipeline metrics and recommends recruiter actions.',
      category: 'Talent',
      status: 'Active',
      updated: '1 week ago',
      dot: 'orange',
    },
  ];

  onStatusChange(value: string): void {
    this.status.set(value);
  }

  setView(view: 'card' | 'list'): void {
    this.view.set(view);
  }
}
