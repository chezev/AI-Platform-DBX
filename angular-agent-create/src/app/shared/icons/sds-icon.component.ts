import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  LucideArrowRight,
  LucideBookOpen,
  LucideBot,
  LucideBotMessageSquare,
  LucideBrainCircuit,
  LucideBug,
  LucideCheck,
  LucideChevronUp,
  LucideCircleCheck,
  LucideCircleDot,
  LucideCircleQuestionMark,
  LucideCircleX,
  LucideClock3,
  LucideCopy,
  LucideDatabase,
  LucideExternalLink,
  LucideFileText,
  LucideGrid2x2,
  LucideInfo,
  LucideLayoutTemplate,
  LucideList,
  LucideMaximize2,
  LucideMinimize2,
  LucidePaperclip,
  LucideRotateCw,
  LucideShieldCheck,
  LucideSparkles,
  LucideTarget,
  LucideTriangleAlert,
  LucideTrash2,
  LucideUserCog,
  LucideWrench,
  LucideX,
} from '@lucide/angular';

const SDS_ICON_ASSETS: Record<string, string> = {
  'ai-panel': 'assets/icons/sds/ai-panel-icon.svg',
  add: 'assets/icons/sds/add-small.svg',
  'agent-hub': 'assets/icons/sds/person-gear-small.svg',
  'ai-search': 'assets/icons/sds/ai-magnifying-glass-default.svg',
  'arrow-left': 'assets/icons/sds/arrow-left-xsmall.svg',
  'arrow-right-circle': 'assets/icons/sds/arrow-right-circle-fill-small.svg',
  bell: 'assets/icons/sds/bell-outline-small.svg',
  'bento-menu': 'assets/icons/sds/bento-menu-outline-small.svg',
  calendar: 'assets/icons/sds/calendar-blank-xsmall.svg',
  'chevron-down': 'assets/icons/sds/chevron-down-small.svg',
  clock: 'assets/icons/sds/circle-clock-small.svg',
  funnel: 'assets/icons/sds/funnel-outline-small.svg',
  gear: 'assets/icons/sds/gear-outline-xsmall.svg',
  'hamburger-menu': 'assets/icons/sds/hamburger-menu-small.svg',
  home: 'assets/icons/sds/home-outline-small.svg',
  kebab: 'assets/icons/sds/kebab-menu-small.svg',
  'layout-lists': 'assets/icons/sds/layout-lists-small.svg',
  search: 'assets/icons/sds/magnifying-glass-small.svg',
  table: 'assets/icons/sds/table-small.svg',
  'rotate-left': 'assets/icons/sds/arrow-rotate-left-outline-small.svg',
};

type LucideFallback =
  | 'arrow-right'
  | 'book-open'
  | 'bot'
  | 'bot-message-square'
  | 'brain-circuit'
  | 'bug'
  | 'check'
  | 'chevron-up'
  | 'circle-check'
  | 'circle-dot'
  | 'circle-question-mark'
  | 'circle-x'
  | 'clock-3'
  | 'copy'
  | 'database'
  | 'external-link'
  | 'file-text'
  | 'grid-2x2'
  | 'info'
  | 'layout-template'
  | 'list'
  | 'maximize'
  | 'minimize'
  | 'paperclip'
  | 'rotate-cw'
  | 'send'
  | 'shield-check'
  | 'sparkles'
  | 'target'
  | 'triangle-alert'
  | 'trash'
  | 'user-cog'
  | 'wrench'
  | 'x';

const LUCIDE_FALLBACKS: Record<string, LucideFallback> = {
  'arrow-right': 'arrow-right',
  'book-open': 'book-open',
  bot: 'bot',
  'bot-message-square': 'bot-message-square',
  'brain-circuit': 'brain-circuit',
  bug: 'bug',
  check: 'check',
  'chevron-up': 'chevron-up',
  'circle-check': 'circle-check',
  'circle-dot': 'circle-dot',
  'circle-x': 'circle-x',
  'clock-3': 'clock-3',
  copy: 'copy',
  database: 'database',
  'external-link': 'external-link',
  'file-text': 'file-text',
  info: 'info',
  'layout-template': 'layout-template',
  maximize: 'maximize',
  minimize: 'minimize',
  paperclip: 'paperclip',
  'rotate-cw': 'rotate-cw',
  send: 'send',
  'shield-check': 'shield-check',
  sparkles: 'sparkles',
  target: 'target',
  'triangle-alert': 'triangle-alert',
  trash: 'trash',
  'user-cog': 'user-cog',
  wrench: 'wrench',
  x: 'x',
  'grid-view': 'grid-2x2',
  'list-view': 'list',
};

@Component({
  selector: 'app-sds-icon',
  standalone: true,
  imports: [
    CommonModule,
    LucideArrowRight,
    LucideBookOpen,
    LucideBot,
    LucideBotMessageSquare,
    LucideBrainCircuit,
    LucideBug,
    LucideCheck,
    LucideChevronUp,
    LucideCircleCheck,
    LucideCircleDot,
    LucideCircleQuestionMark,
    LucideCircleX,
    LucideClock3,
    LucideCopy,
    LucideDatabase,
    LucideExternalLink,
    LucideFileText,
    LucideGrid2x2,
    LucideInfo,
    LucideLayoutTemplate,
    LucideList,
    LucideMaximize2,
    LucideMinimize2,
    LucidePaperclip,
    LucideRotateCw,
    LucideShieldCheck,
    LucideSparkles,
    LucideTarget,
    LucideTriangleAlert,
    LucideTrash2,
    LucideUserCog,
    LucideWrench,
    LucideX,
  ],
  template: `
    @if (sdsAsset(); as asset) {
      <img
        class="sds-icon-image"
        [src]="asset"
        [style.width.px]="size()"
        [style.height.px]="size()"
        [attr.aria-hidden]="decorative() ? 'true' : null"
        [attr.alt]="decorative() ? '' : resolvedAlt()"
      />
    } @else {
      @switch (fallback()) {
        @case ('arrow-right') {
          <svg lucideArrowRight [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('book-open') {
          <svg lucideBookOpen [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('bot') {
          <svg lucideBot [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('bot-message-square') {
          <svg lucideBotMessageSquare [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('brain-circuit') {
          <svg lucideBrainCircuit [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('bug') {
          <svg lucideBug [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('check') {
          <svg lucideCheck [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('chevron-up') {
          <svg lucideChevronUp [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('circle-check') {
          <svg lucideCircleCheck [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('circle-dot') {
          <svg lucideCircleDot [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('circle-x') {
          <svg lucideCircleX [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('clock-3') {
          <svg lucideClock3 [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('copy') {
          <svg lucideCopy [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('database') {
          <svg lucideDatabase [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('external-link') {
          <svg lucideExternalLink [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('file-text') {
          <svg lucideFileText [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('info') {
          <svg lucideInfo [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('layout-template') {
          <svg lucideLayoutTemplate [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('paperclip') {
          <svg lucidePaperclip [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('rotate-cw') {
          <svg lucideRotateCw [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('send') {
          <svg
            [attr.width]="size()"
            [attr.height]="size()"
            viewBox="0 0 15 15"
            fill="currentColor"
            [attr.aria-hidden]="decorative() ? 'true' : null"
          >
            <path d="M13 7.5L2 2L5.5 7.5L2 13L13 7.5Z" />
          </svg>
        }
        @case ('shield-check') {
          <svg lucideShieldCheck [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('sparkles') {
          <svg lucideSparkles [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('target') {
          <svg lucideTarget [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('triangle-alert') {
          <svg lucideTriangleAlert [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('trash') {
          <svg lucideTrash2 [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('user-cog') {
          <svg lucideUserCog [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('wrench') {
          <svg lucideWrench [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('x') {
          <svg lucideX [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('grid-2x2') {
          <svg lucideGrid2x2 [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('list') {
          <svg lucideList [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('maximize') {
          <svg lucideMaximize2 [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @case ('minimize') {
          <svg lucideMinimize2 [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
        @default {
          <svg lucideCircleQuestionMark [size]="size()" [attr.aria-hidden]="decorative() ? 'true' : null"></svg>
        }
      }
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: currentColor;
    }

    .sds-icon-image {
      display: block;
      object-fit: contain;
      filter: var(--sds-icon-filter, none);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsIconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(16);
  readonly decorative = input<boolean>(true);
  readonly alt = input<string>('');

  protected readonly sdsAsset = computed(() => SDS_ICON_ASSETS[this.name()] ?? null);
  protected readonly fallback = computed<LucideFallback>(
    () => LUCIDE_FALLBACKS[this.name()] ?? 'circle-question-mark',
  );

  protected resolvedAlt(): string {
    return this.alt() || this.name();
  }
}
