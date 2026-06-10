import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AgentApiService } from '../../core/agent-api.service';
import { AgentSummary } from '../../core/agent-api.types';
import { ProjectApiService } from '../../core/project-api.service';
import { KbService } from '../../core/kb.service';
import { SdsIconComponent } from '../icons/sds-icon.component';

type SearchKind = 'Agent' | 'Project' | 'Skill' | 'Knowledge Base' | 'Tool';

interface SearchItem {
  id: string;
  kind: SearchKind;
  name: string;
  subtitle: string;
  /** Deco-icon asset (agents) rendered as <img>. */
  logoSrc?: string;
  /** SdsIcon name (everything else) rendered in a tinted chip. */
  icon?: string;
  link: unknown[];
  query?: Record<string, string>;
}

@Component({
  selector: 'app-sds-topbar',
  standalone: true,
  imports: [SdsIconComponent],
  template: `
    <header class="sds-app-topbar">
      <img src="assets/brand/darwinbox-logo.png" alt="Darwinbox" class="sds-app-logo" />

      <label class="sds-app-search" [for]="searchId()">
        <app-sds-icon name="search" [size]="18"></app-sds-icon>
        <input
          [id]="searchId()"
          type="text"
          [placeholder]="searchPlaceholder()"
          [value]="searchValue()"
          (input)="searchValueChange.emit($any($event.target).value)"
          (focus)="focused.set(true)"
          (blur)="focused.set(false)"
          autocomplete="off"
        />

        @if (showDropdown()) {
          <div class="search-dropdown" role="listbox" aria-label="Search results">
            @for (item of results(); track item.kind + item.id) {
              <button type="button" class="search-result" role="option" (mousedown)="open(item)">
                @if (item.logoSrc) {
                  <img class="result-icon" [src]="item.logoSrc" alt="" aria-hidden="true" />
                } @else {
                  <span class="result-icon result-chip">
                    <app-sds-icon [name]="item.icon!" [size]="16"></app-sds-icon>
                  </span>
                }
                <span class="result-text">
                  <span class="result-name">{{ item.name }}</span>
                  <span class="result-meta">{{ item.kind }} · {{ item.subtitle }}</span>
                </span>
                <span class="result-date">{{ createdLabel }}</span>
              </button>
            }
          </div>
        }
      </label>

      <div class="sds-app-actions" aria-label="Top actions">
        <button type="button" class="topbar-icon" [class.is-on]="darkMode()" aria-label="Toggle dark mode" (click)="toggleDark()">
          @if (darkMode()) {
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          } @else {
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          }
        </button>

        <button type="button" class="sds-app-user" aria-label="Profile">
          <img class="user-avatar" src="assets/brand/avatar.jpg" alt="" />
          <span class="user-name">{{ profileLabel() }}</span>
        </button>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
      flex: 0 0 auto;
    }

    .sds-app-topbar {
      height: var(--sds-app-topbar-height, var(--sds-size-56));
      width: 100%;
      padding: 0 var(--sds-padding-16);
      border-bottom: 1px solid var(--sds-border-neutralGrey-light2);
      background: var(--sds-bg-neutralWhite-default);
      display: grid;
      grid-template-columns: auto auto 1fr;
      align-items: center;
      gap: var(--sds-gap-24);
    }

    .sds-app-logo {
      width: 114px;
      height: auto;
      display: block;
      justify-self: start;
    }

    .sds-app-search {
      width: 560px;
      justify-self: start;
      position: relative;
      min-height: var(--sds-control-height);
      border: 1px solid var(--sds-border-primary-default);
      border-radius: var(--sds-border-radius-full);
      background: var(--sds-bg-neutralWhite-default);
      padding: 0 var(--sds-padding-16);
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
    }

    .sds-app-search:hover {
      border-color: var(--sds-border-neutralGrey-hover);
    }

    .sds-app-search:focus-within {
      border-color: var(--sds-border-neutralBlue-active);
      box-shadow: 0 0 0 1px var(--sds-border-neutralBlue-active);
    }

    .sds-app-search > app-sds-icon {
      color: var(--sds-text-neutral-ghost);
      flex: 0 0 auto;
    }

    .sds-app-search input {
      width: 100%;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--sds-text-neutral-title);
      font-family: inherit;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
    }

    .sds-app-search input::placeholder {
      color: var(--sds-text-neutral-ghost);
    }

    /* ── Global search dropdown ── */
    .search-dropdown {
      position: absolute;
      top: calc(100% + var(--sds-gap-8));
      left: 0;
      right: 0;
      z-index: 60;
      padding: var(--sds-padding-8);
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      box-shadow: var(--sds-shadow-dropdown);
      display: flex;
      flex-direction: column;
      gap: 2px;
      max-height: 380px;
      overflow-y: auto;
    }

    .search-result {
      display: flex;
      align-items: center;
      gap: var(--sds-gap-12);
      border: none;
      background: transparent;
      text-align: left;
      padding: var(--sds-padding-8);
      border-radius: var(--sds-border-radius-4);
      cursor: pointer;
      font-family: inherit;
    }

    .search-result:hover {
      background: var(--sds-bg-neutralGrey-light1);
    }

    .result-icon {
      width: 20px;
      height: 20px;
      object-fit: contain;
      flex: 0 0 auto;
    }

    .result-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--sds-border-radius-4);
      background: var(--sds-bg-neutralGrey-light2);
      color: var(--sds-text-neutral-label);
    }

    .result-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    .result-name {
      color: var(--sds-text-neutral-title);
      font-size: var(--sds-body-m-medium-font-size);
      font-weight: var(--sds-body-m-medium-font-weight);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .result-meta {
      color: var(--sds-text-neutral-label);
      font-size: var(--sds-body-s-book-font-size);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .result-date {
      color: var(--sds-text-neutral-ghost);
      font-size: var(--sds-body-s-book-font-size);
      flex: 0 0 auto;
    }

    .sds-app-actions {
      justify-self: end;
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
    }

    .topbar-icon {
      width: var(--sds-control-height);
      height: var(--sds-control-height);
      border: none;
      border-radius: var(--sds-border-radius-full);
      background: transparent;
      color: var(--sds-text-neutral-label);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .topbar-icon:hover {
      background: var(--sds-bg-neutralGrey-light2);
      color: var(--sds-text-neutral-title);
    }

    .topbar-icon.is-on {
      color: var(--sds-bg-neutralBlue-active);
    }

    .sds-app-user {
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
      height: var(--sds-control-height);
      padding: 0 var(--sds-padding-8) 0 0;
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-full);
      background: var(--sds-bg-neutralWhite-default);
      color: var(--sds-text-neutral-title);
      font-family: inherit;
      font-size: var(--sds-body-s-medium-font-size);
      font-weight: var(--sds-body-s-medium-font-weight);
      cursor: pointer;
    }

    .sds-app-user:hover {
      background: var(--sds-bg-neutralGrey-light1);
    }

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      object-fit: cover;
      flex: 0 0 auto;
    }

    .user-name {
      white-space: nowrap;
    }

    @media (max-width: 920px) {
      .sds-app-topbar {
        grid-template-columns: auto 1fr;
        grid-template-areas:
          'logo actions'
          'search search';
        height: auto;
        padding: var(--sds-padding-12) var(--sds-padding-16);
      }

      .sds-app-logo {
        grid-area: logo;
      }

      .sds-app-search {
        grid-area: search;
        width: 100%;
      }

      .sds-app-actions {
        grid-area: actions;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdsAppTopbarComponent {
  private readonly agentApi = inject(AgentApiService);
  private readonly projectApi = inject(ProjectApiService);
  private readonly kb = inject(KbService);
  private readonly router = inject(Router);

  readonly searchId = input('sds-global-search');
  readonly searchPlaceholder = input('Search agents, projects, skills, knowledge bases, tools…');
  readonly searchValue = input('');
  readonly profileLabel = input('Chaitanya K');
  readonly searchValueChange = output<string>();

  readonly focused = signal(false);
  readonly darkMode = signal(false);
  readonly createdLabel = '27 Jan 2026';

  private readonly agents = toSignal(this.agentApi.listAgents({}), { initialValue: [] as AgentSummary[] });

  /** Skills & tools live inline in their pages; mirror a small catalog here for search. */
  private readonly skills: SearchItem[] = [
    { id: 'brd', kind: 'Skill', name: 'BRD Generator', subtitle: 'Documentation', icon: 'sparkles', link: ['/agent-resources/skill-registry'] },
    { id: 'tah', kind: 'Skill', name: 'Talent Acquisition Hub', subtitle: 'Recruitment', icon: 'sparkles', link: ['/agent-resources/skill-registry'] },
    { id: 'wfa', kind: 'Skill', name: 'Workflow Automator', subtitle: 'Operations', icon: 'sparkles', link: ['/agent-resources/skill-registry'] },
    { id: 'pre', kind: 'Skill', name: 'Performance Review Engine', subtitle: 'Performance', icon: 'sparkles', link: ['/agent-resources/skill-registry'] },
  ];

  private readonly tools: SearchItem[] = [
    { id: 'confluence', kind: 'Tool', name: 'Confluence Doc Agent', subtitle: 'Documentation', icon: 'wrench', link: ['/agent-resources/tool-registry'] },
    { id: 'slack', kind: 'Tool', name: 'My Slack', subtitle: 'Communication', icon: 'wrench', link: ['/agent-resources/tool-registry'] },
    { id: 'jira', kind: 'Tool', name: 'My Jira', subtitle: 'Project tracking', icon: 'wrench', link: ['/agent-resources/tool-registry'] },
    { id: 'payslip', kind: 'Tool', name: 'Fetch Payslip', subtitle: 'Payroll', icon: 'wrench', link: ['/agent-resources/tool-registry'] },
  ];

  private readonly catalog = computed<SearchItem[]>(() => {
    const agents: SearchItem[] = this.agents().map((a) => ({
      id: a.id,
      kind: 'Agent',
      name: a.name,
      subtitle: a.category,
      logoSrc: `assets/icons/agents/${a.icon ?? 'manager-copilot'}.svg`,
      link: ['/agent-creation/template', a.id],
      query: { source: 'existing', name: a.name },
    }));

    const projects: SearchItem[] = this.projectApi.allProjects().map((p) => ({
      id: p.id,
      kind: 'Project',
      name: p.name,
      subtitle: p.description?.trim() || 'Project',
      icon: 'layout-lists',
      link: ['/agent-hub/projects', p.id],
    }));

    const kbs: SearchItem[] = this.kb.allKbs().map((k) => ({
      id: k.id,
      kind: 'Knowledge Base',
      name: k.name,
      subtitle: k.description?.trim() || `${k.documents} documents`,
      icon: 'database',
      link: ['/agent-resources/knowledge-base', k.id],
    }));

    return [...agents, ...projects, ...kbs, ...this.skills, ...this.tools];
  });

  readonly results = computed<SearchItem[]>(() => {
    const term = this.searchValue().trim().toLowerCase();
    if (!term) return [];
    return this.catalog()
      .filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.subtitle.toLowerCase().includes(term) ||
          i.kind.toLowerCase().includes(term),
      )
      .slice(0, 7);
  });

  readonly showDropdown = computed(() => this.focused() && this.searchValue().trim().length > 0 && this.results().length > 0);

  open(item: SearchItem): void {
    this.focused.set(false);
    void this.router.navigate(item.link, item.query ? { queryParams: item.query } : {});
  }

  toggleDark(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    document.documentElement.classList.toggle('dark', next);
  }
}
