import { Directive } from '@angular/core';

@Directive({
  selector: '[sdsCard]',
  standalone: true,
  host: {
    class: 'sds-card',
  },
})
export class SdsCardDirective {}

@Directive({
  selector: '[sdsCardHeader]',
  standalone: true,
  host: {
    class: 'sds-card-header',
  },
})
export class SdsCardHeaderDirective {}

@Directive({
  selector: '[sdsCardTitle]',
  standalone: true,
  host: {
    class: 'sds-card-title',
  },
})
export class SdsCardTitleDirective {}

@Directive({
  selector: '[sdsFormSection]',
  standalone: true,
  host: {
    class: 'sds-form-section',
  },
})
export class SdsFormSectionDirective {}

@Directive({
  selector: '[sdsSectionHeader]',
  standalone: true,
  host: {
    class: 'sds-section-header',
  },
})
export class SdsSectionHeaderDirective {}

@Directive({
  selector: '[sdsFieldGrid]',
  standalone: true,
  host: {
    class: 'sds-field-grid',
  },
})
export class SdsFieldGridDirective {}

@Directive({
  selector: '[sdsField]',
  standalone: true,
  host: {
    class: 'sds-field',
  },
})
export class SdsFieldDirective {}

@Directive({
  selector: 'input[sdsInput]',
  standalone: true,
  host: {
    class: 'sds-input',
  },
})
export class SdsInputDirective {}

@Directive({
  selector: 'textarea[sdsTextarea]',
  standalone: true,
  host: {
    class: 'sds-textarea',
  },
})
export class SdsTextareaDirective {}
