import { Directive } from '@angular/core';

@Directive({
  selector: '[sdsPage]',
  standalone: true,
  host: { class: 'sds-page' },
})
export class SdsPageDirective {}

@Directive({
  selector: '[sdsPageHeader]',
  standalone: true,
  host: { class: 'sds-page-header' },
})
export class SdsPageHeaderDirective {}

@Directive({
  selector: '[sdsPanel]',
  standalone: true,
  host: { class: 'sds-panel' },
})
export class SdsPanelDirective {}

@Directive({
  selector: '[sdsToolbar]',
  standalone: true,
  host: { class: 'sds-toolbar' },
})
export class SdsToolbarDirective {}

@Directive({
  selector: '[sdsSearchField]',
  standalone: true,
  host: { class: 'sds-search-field' },
})
export class SdsSearchFieldDirective {}

@Directive({
  selector: '[sdsBadge]',
  standalone: true,
  host: { class: 'sds-badge' },
})
export class SdsBadgeDirective {}

@Directive({
  selector: '[sdsResourceCard]',
  standalone: true,
  host: { class: 'sds-resource-card' },
})
export class SdsResourceCardDirective {}
