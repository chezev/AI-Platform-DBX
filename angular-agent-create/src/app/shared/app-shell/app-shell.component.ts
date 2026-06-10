import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SdsIconComponent } from '../icons/sds-icon.component';
import { SdsButtonComponent } from '../spartan/sds-button';
import { SdsAppTopbarComponent } from './sds-app-topbar.component';
import { FlowEmbedState } from './flow-embed-state';
import { ProjectCreateState } from './project-create-state';
import { KbCreateState } from './kb-create-state';
import { PRODUCT_SECTIONS, ProductSection } from './product-nav.config';

/**
 * Shared application shell: global topbar + product navigation + per-section
 * sub-tabs (or a breadcrumb when drilled down) + section CTA, with a router
 * outlet for the active page. This is the single place that owns the chrome —
 * edit it (or product-nav.config.ts) once and every section reflects it.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SdsAppTopbarComponent, SdsIconComponent, SdsButtonComponent],
  template: `
    <div class="app-shell">
      <!-- All chrome collapses while the embedded flow builder is open, leaving
           just the builder's own breadcrumb (no double navigation). -->
      @if (!embed.inBuilder()) {
        <app-sds-topbar
          searchId="app-global-search"
          [searchValue]="globalSearch()"
          (searchValueChange)="globalSearch.set($event)"
        ></app-sds-topbar>

        <nav class="product-nav" aria-label="Product navigation">
          <button type="button" class="product-nav-leading" aria-label="AI Platform">
            <app-sds-icon name="bot-message-square" [size]="20"></app-sds-icon>
          </button>

          @for (section of sections; track section.id) {
            @if (section.disabled) {
              <button type="button" class="product-nav-item is-disabled" disabled>{{ section.label }}</button>
            } @else {
              <a class="product-nav-item" [class.is-active]="section.id === activeSection()?.id" [routerLink]="section.path">
                {{ section.label }}
              </a>
            }
          }
        </nav>

        @if (activeSection(); as section) {
          <div class="workspace-heading">
            @if (breadcrumb(); as crumb) {
              <nav class="shell-breadcrumb" aria-label="Breadcrumb">
                <a [routerLink]="section.path">{{ section.label }}</a>
                <span>/</span>
                <strong>{{ crumb }}</strong>
              </nav>
            } @else {
              <div class="module-tabs" aria-label="Section tabs">
                @for (tab of section.tabs; track tab.path) {
                  <a class="module-tab-button" [routerLink]="tab.path" routerLinkActive="is-active">{{ tab.label }}</a>
                }
              </div>
            }

            @if (isAgenticFlows()) {
              <div class="shell-create">
                <button type="button" sdsButton variant="primary" (click)="createMenuOpen.set(!createMenuOpen())">
                  Create Flow
                </button>
                @if (createMenuOpen()) {
                  <div class="shell-create-backdrop" (click)="createMenuOpen.set(false)"></div>
                  <div class="shell-create-menu" role="menu" aria-label="Create flow">
                    <button type="button" class="shell-create-item" role="menuitem" (click)="createFlow('scratch')">
                      <app-sds-icon name="add" [size]="16"></app-sds-icon>
                      <span>
                        <strong>Start from scratch</strong>
                        <small>Begin with a blank canvas</small>
                      </span>
                    </button>
                    <button type="button" class="shell-create-item" role="menuitem" (click)="createFlow('ai')">
                      <app-sds-icon name="ai-panel" [size]="16"></app-sds-icon>
                      <span>
                        <strong>Build with AI</strong>
                        <small>Draft your flow with AI</small>
                      </span>
                    </button>
                  </div>
                }
              </div>
            } @else if (isProjects()) {
              <button type="button" sdsButton variant="primary" (click)="projectCreate.requestCreate()">
                New Project
              </button>
            } @else if (isKnowledgeBase()) {
              <button type="button" sdsButton variant="primary" (click)="kbCreate.requestCreate()">
                <app-sds-icon name="add" [size]="16"></app-sds-icon>
                New Knowledge Base
              </button>
            } @else if (activeTabCta(); as cta) {
              <a [routerLink]="cta.path" sdsButton variant="primary">
                <app-sds-icon name="add" [size]="16"></app-sds-icon>
                {{ cta.label }}
              </a>
            } @else if (!isProjectsSection() && section.cta; as cta) {
              <a [routerLink]="cta.path" sdsButton variant="primary">
                {{ cta.label }}
              </a>
            }
          </div>
        }
      }

      <main class="shell-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: var(--sds-bg-neutralGrey-light2);
      color: var(--sds-text-neutral-body);
      font-family: 'Darwin Sans', 'Segoe UI', sans-serif;
    }

    .app-shell {
      height: 100dvh;
      display: flex;
      flex-direction: column;
    }

    .product-nav {
      min-height: 40px;
      width: 100%;
      padding: 0 var(--sds-padding-24) 0 0;
      background: var(--sds-bg-primary-active);
      display: flex;
      align-items: stretch;
      gap: 0;
    }

    /* Full-height black block; right edge lines up with the Darwinbox "d" mark. */
    .product-nav-leading {
      width: 50px;
      min-width: 50px;
      align-self: stretch;
      padding: 0;
      border: none;
      background: #000;
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .product-nav-leading app-sds-icon {
      color: #ffffff;
      --sds-icon-filter: brightness(0) saturate(100%) invert(100%);
    }

    .product-nav-item {
      min-height: 40px;
      border: none;
      padding: 0 var(--sds-padding-24);
      background: transparent;
      color: #ffffff;
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
      font-family: inherit;
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      cursor: pointer;
    }

    .product-nav-item:not(.is-disabled):hover {
      background: var(--sds-bg-primary-hover);
    }

    .product-nav-item.is-active {
      background: var(--sds-bg-primary-hover);
      border-bottom: 2px solid var(--sds-border-neutralBlue-active);
    }

    .product-nav-item.is-disabled {
      color: var(--sds-text-neutral-ghost);
      cursor: not-allowed;
    }

    .workspace-heading {
      min-height: 48px;
      padding: 0 var(--sds-padding-24);
      background: var(--sds-bg-neutralWhite-default);
      border-bottom: 1px solid var(--sds-border-neutralGrey-light2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sds-gap-16);
    }

    .module-tabs {
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
    }

    .module-tab-button {
      min-height: 48px;
      border: none;
      background: transparent;
      color: var(--sds-text-neutral-label);
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
      padding: 0 var(--sds-padding-12);
      font-size: var(--sds-body-m-book-font-size);
      font-weight: var(--sds-body-m-book-font-weight);
      line-height: var(--sds-body-m-book-line-height);
      font-family: inherit;
      text-decoration: none;
      cursor: pointer;
    }

    .module-tab-button.is-active {
      color: var(--sds-text-neutral-title);
      font-weight: var(--sds-body-m-medium-font-weight);
      border-bottom: 2px solid var(--sds-border-neutralBlue-active);
    }

    .shell-breadcrumb {
      display: inline-flex;
      align-items: center;
      gap: var(--sds-gap-8);
      font-size: var(--sds-body-m-book-font-size);
      line-height: var(--sds-body-m-book-line-height);
    }

    .shell-breadcrumb a {
      color: var(--sds-text-neutral-label);
      text-decoration: none;
    }

    .shell-breadcrumb a:hover {
      color: var(--sds-text-neutral-title);
    }

    .shell-breadcrumb span {
      color: var(--sds-text-neutral-ghost);
    }

    .shell-breadcrumb strong {
      color: var(--sds-text-neutral-title);
      font-weight: var(--sds-body-m-medium-font-weight);
    }

    .shell-content {
      /* Fills the space under the chrome; scrolls here (not the document) so the
         topbar + nav + sub-tabs stay fixed. Pages that want only an inner region
         to scroll (e.g. the Agents table) fill 100% and scroll internally. */
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
    }

    .shell-create {
      position: relative;
    }

    .shell-create-backdrop {
      position: fixed;
      inset: 0;
      z-index: 40;
    }

    .shell-create-menu {
      position: absolute;
      top: calc(100% + var(--sds-gap-8));
      right: 0;
      z-index: 41;
      min-width: 240px;
      padding: var(--sds-padding-8);
      border: 1px solid var(--sds-border-neutralGrey-light2);
      border-radius: var(--sds-border-radius-8);
      background: var(--sds-bg-neutralWhite-default);
      box-shadow: var(--sds-shadow-dropdown);
      display: flex;
      flex-direction: column;
      gap: var(--sds-gap-4);
    }

    .shell-create-item {
      display: flex;
      align-items: flex-start;
      gap: var(--sds-gap-12);
      padding: var(--sds-padding-8) var(--sds-padding-12);
      border: none;
      border-radius: var(--sds-border-radius-4);
      background: transparent;
      color: var(--sds-text-neutral-title);
      font-family: inherit;
      text-align: left;
      cursor: pointer;
    }

    .shell-create-item:hover {
      background: var(--sds-bg-neutralGrey-light2);
    }

    .shell-create-item span {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .shell-create-item strong {
      font-size: var(--sds-body-m-medium-font-size);
      font-weight: var(--sds-body-m-medium-font-weight);
      line-height: var(--sds-body-m-medium-line-height);
    }

    .shell-create-item small {
      color: var(--sds-text-neutral-ghost);
      font-size: var(--sds-body-s-book-font-size);
      line-height: var(--sds-body-s-book-line-height);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly embed = inject(FlowEmbedState);
  protected readonly projectCreate = inject(ProjectCreateState);
  protected readonly kbCreate = inject(KbCreateState);

  readonly sections = PRODUCT_SECTIONS;
  readonly globalSearch = signal('');

  private readonly url = signal(this.router.url);
  readonly breadcrumb = signal<string | null>(this.readBreadcrumb());

  readonly activeSection = computed<ProductSection | undefined>(() => {
    const url = this.url();
    return this.sections.find((section) => !section.disabled && url.startsWith(section.path));
  });

  // CTA of the active sub-tab (e.g. "Add Tool" on Tool Registry), if any.
  readonly activeTabCta = computed(() => {
    const url = this.url().split('?')[0];
    const tab = this.activeSection()?.tabs.find((t) => url.startsWith(t.path));
    return tab?.cta;
  });

  // Agentic Flows is an embedded React app with its own Create button, so the
  // section's "Create Agent" CTA is suppressed on that tab.
  readonly isAgenticFlows = computed(() => this.url().startsWith('/agent-hub/agentic-flows'));
  // The Projects list shows its own "New Project" CTA; the detail page (deeper
  // path) shows neither that nor "Create Agent".
  readonly isProjects = computed(() => {
    const url = this.url().split('?')[0];
    return url === '/agent-hub/projects';
  });
  readonly isProjectsSection = computed(() => this.url().startsWith('/agent-hub/projects'));
  // KB list owns its own "New Knowledge Base" CTA (opens the create drawer).
  readonly isKnowledgeBase = computed(() => this.url().split('?')[0] === '/agent-resources/knowledge-base');
  readonly createMenuOpen = signal(false);

  createFlow(kind: 'scratch' | 'ai'): void {
    this.embed.requestCreate(kind);
    this.createMenuOpen.set(false);
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.url.set(this.router.url);
        this.breadcrumb.set(this.readBreadcrumb());
      });
  }

  /** Deepest activated route's `data.breadcrumb` (set by drill-down pages). */
  private readBreadcrumb(): string | null {
    let node = this.route.snapshot.firstChild;
    let crumb: string | null = null;
    while (node) {
      const value = node.data?.['breadcrumb'];
      if (typeof value === 'string') {
        crumb = value;
      }
      node = node.firstChild;
    }
    return crumb;
  }
}
