import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SdsAppTopbarComponent } from '../shared/app-shell/sds-app-topbar.component';
import { SdsIconComponent } from '../shared/icons/sds-icon.component';
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
  SdsSelectGroupLabelComponent,
  SdsSelectItemComponent,
  SdsSelectPortalDirective,
  SdsSelectTriggerComponent,
} from '../shared/spartan/sds-select';

type ComponentGroup = {
  title: string;
  description: string;
  items: string[];
};

@Component({
  selector: 'app-component-library',
  standalone: true,
  imports: [
    SdsButtonComponent,
    SdsIconButtonComponent,
    SdsAppTopbarComponent,
    SdsIconComponent,
    SdsSelectDirective,
    SdsSelectTriggerComponent,
    SdsSelectContentComponent,
    SdsSelectGroupLabelComponent,
    SdsSelectItemComponent,
    SdsSelectPortalDirective,
    SdsFormSectionDirective,
    SdsSectionHeaderDirective,
    SdsFieldGridDirective,
    SdsFieldDirective,
    SdsInputDirective,
    SdsTextareaDirective,
    SdsCardDirective,
    SdsCardHeaderDirective,
    SdsCardTitleDirective,
    SdsPageDirective,
    SdsPageHeaderDirective,
    SdsPanelDirective,
    SdsToolbarDirective,
    SdsSearchFieldDirective,
    SdsBadgeDirective,
    SdsResourceCardDirective,
  ],
  templateUrl: './component-library.component.html',
  styleUrl: './component-library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentLibraryComponent {
  readonly status = signal('All');
  readonly project = signal('New Agents');
  readonly model = signal('GPT 5.4 Extended Thinking');
  readonly statusOptions = ['All', 'Active', 'Draft'];
  readonly projectOptions = ['New Agents', 'Talent Acquisition', 'Onboarding', 'HR Payroll'];
  readonly modelOptions = ['GPT 5.4 Extended Thinking', 'Claude Sonnet 4.6', 'Gemini 2.5 Pro'];
  readonly triggerOptions = ['Super Agent', 'Web', 'Agent Node In Flows'];

  readonly sdsReadyGroups: ComponentGroup[] = [
    {
      title: 'Actions',
      description: 'Buttons and icon buttons with SDS size, hover, focus, inverse, and disabled states.',
      items: ['Button', 'Icon Button', 'Toolbar Action', 'Header Action', 'Kebab Action'],
    },
    {
      title: 'Forms',
      description: 'Shared field rhythm for labels, controls, help text, required state, and chevron spacing.',
      items: ['Input', 'Textarea', 'Search Field', 'Select', 'Multi-Select Tags', 'Field Grid', 'Form Section'],
    },
    {
      title: 'Containers',
      description: 'Reusable enterprise layout surfaces for forms, lists, resources, and page sections.',
      items: ['App Topbar', 'Page', 'Page Header', 'Panel', 'Card', 'Resource Card', 'Toolbar', 'Badge'],
    },
    {
      title: 'Product Patterns',
      description: 'Patterns we reuse across AI-native screens instead of rebuilding per page.',
      items: ['Agent Card', 'List Toolbar', 'Catalog Picker', 'Config Navigation', 'AI Assist Panel', 'Empty State'],
    },
  ];

  readonly primitiveGroups: ComponentGroup[] = [
    {
      title: 'Form Controls',
      description: 'Raw shadcn/Spartan primitives present in the repo and ready to wrap with SDS tokens.',
      items: [
        'Autocomplete',
        'Button',
        'Button Group',
        'Checkbox',
        'Combobox',
        'Field',
        'Input',
        'Input Group',
        'Input OTP',
        'Label',
        'Native Select',
        'Radio Group',
        'Select',
        'Slider',
        'Switch',
        'Textarea',
        'Toggle',
        'Toggle Group',
      ],
    },
    {
      title: 'Overlays',
      description: 'Modal, menu, and contextual disclosure primitives for enterprise workflows.',
      items: [
        'Alert Dialog',
        'Context Menu',
        'Dialog',
        'Dropdown Menu',
        'Hover Card',
        'Popover',
        'Sheet',
        'Tooltip',
      ],
    },
    {
      title: 'Navigation',
      description: 'Navigation and wayfinding primitives for multi-page products.',
      items: ['Breadcrumb', 'Menubar', 'Navigation Menu', 'Pagination', 'Sidebar', 'Tabs'],
    },
    {
      title: 'Data Display',
      description: 'Display, feedback, and loading primitives for dense SaaS surfaces.',
      items: [
        'Accordion',
        'Alert',
        'Aspect Ratio',
        'Avatar',
        'Badge',
        'Calendar',
        'Card',
        'Carousel',
        'Date Picker',
        'Empty',
        'Item',
        'Kbd',
        'Progress',
        'Scroll Area',
        'Separator',
        'Skeleton',
        'Spinner',
        'Table',
        'Typography',
      ],
    },
  ];

  get primitiveCount(): number {
    return this.primitiveGroups.reduce((total, group) => total + group.items.length, 0);
  }

  get sdsReadyCount(): number {
    return this.sdsReadyGroups.reduce((total, group) => total + group.items.length, 0);
  }

  onStatusChange(value: string): void {
    this.status.set(value);
  }

  onProjectChange(value: string): void {
    this.project.set(value);
  }

  onModelChange(value: string): void {
    this.model.set(value);
  }
}
