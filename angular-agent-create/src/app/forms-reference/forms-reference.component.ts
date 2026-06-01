import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
import { SdsButtonComponent, SdsIconButtonComponent } from '../shared/spartan/sds-button';
import {
  SdsCardDirective,
  SdsFieldDirective,
  SdsFieldGridDirective,
  SdsFormSectionDirective,
  SdsInputDirective,
  SdsSectionHeaderDirective,
  SdsTextareaDirective,
} from '../shared/spartan/sds-form';
import {
  SdsPageDirective,
  SdsPageHeaderDirective,
  SdsPanelDirective,
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

@Component({
  selector: 'app-forms-reference',
  standalone: true,
  imports: [
    SdsIconComponent,
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsCardDirective,
    SdsFormSectionDirective,
    SdsSectionHeaderDirective,
    SdsFieldGridDirective,
    SdsFieldDirective,
    SdsInputDirective,
    SdsTextareaDirective,
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
  ],
  templateUrl: './forms-reference.component.html',
  styleUrl: './forms-reference.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsReferenceComponent {
  readonly project = signal('New Agents');
  readonly provider = signal('ChatGPT');
  readonly model = signal('GPT 5.4 Extended Thinking');
  readonly status = signal('All');

  readonly projectOptions = ['New Agents', 'Talent Acquisition', 'Onboarding', 'HR Payroll'];
  readonly providerOptions = ['ChatGPT', 'Anthropic', 'Google Gemini'];
  readonly modelOptions = ['GPT 5.4 Extended Thinking', 'GPT 4.1', 'Claude Sonnet 4.5'];
  readonly statusOptions = ['All', 'Active', 'Draft'];

  onProjectChange(value: string): void {
    this.project.set(value);
  }

  onProviderChange(value: string): void {
    this.provider.set(value);
  }

  onModelChange(value: string): void {
    this.model.set(value);
  }

  onStatusChange(value: string): void {
    this.status.set(value);
  }
}
