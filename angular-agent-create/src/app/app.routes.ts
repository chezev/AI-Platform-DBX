import { Routes } from '@angular/router';
import { AgentCreateScreenComponent } from './agent-create-screen/agent-create-screen.component';
import { AgentCreationListComponent } from './agent-creation-list/agent-creation-list.component';
import { AgentProjectsListComponent } from './agent-projects-list/agent-projects-list.component';
import { AgentProjectDetailComponent } from './agent-project-detail/agent-project-detail.component';
import { AgentStartupPlaceholderComponent } from './agent-startup-placeholder/agent-startup-placeholder.component';
import { AgentTestScreenComponent } from './agent-test-screen/agent-test-screen.component';
import { AgentTemplateDetailComponent } from './agent-template-detail/agent-template-detail.component';
import { RunDetailComponent } from './run-detail/run-detail.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { ComponentLibraryComponent } from './component-library/component-library.component';
import { ExamplePagesComponent } from './example-pages/example-pages.component';
import { FlowBuilderComponent } from './flow-builder/flow-builder.component';
import { FormsReferenceComponent } from './forms-reference/forms-reference.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { KnowledgeBaseDetailComponent } from './knowledge-base-detail/knowledge-base-detail.component';
import { SkillRegistryComponent } from './skill-registry/skill-registry.component';
import { SkillNewComponent } from './skill-new/skill-new.component';
import { ToolRegistryComponent } from './tool-registry/tool-registry.component';
import { ToolNewComponent } from './tool-new/tool-new.component';
import { AgenticFlowsComponent } from './agentic-flows/agentic-flows.component';
import { AppShellComponent } from './shared/app-shell/app-shell.component';
import { PlaceholderPageComponent } from './shared/app-shell/placeholder-page.component';

export const routes: Routes = [
  // Standalone pages that own their chrome (drill-down / create flows / dev refs).
  { path: 'agent-creation/startup', component: AgentStartupPlaceholderComponent },
  { path: 'agent-creation/template/:templateId', component: AgentTemplateDetailComponent },
  { path: 'agent-creation/run/:runId', component: RunDetailComponent },
  { path: 'agent-creation/session/:sessionId', component: SessionDetailComponent },
  { path: 'agent-creation/create', component: AgentCreateScreenComponent },
  { path: 'agent-creation/test', component: AgentTestScreenComponent },
  { path: 'agent-resources/knowledge-base/:kbId', component: KnowledgeBaseDetailComponent },
  { path: 'agent-resources/tool-registry/new', component: ToolNewComponent },
  { path: 'agent-resources/skill-registry/new', component: SkillNewComponent },
  { path: 'flowbuilder', component: FlowBuilderComponent },
  { path: 'components', component: ComponentLibraryComponent },
  { path: 'forms', component: FormsReferenceComponent },
  { path: 'examples', component: ExamplePagesComponent },

  // Legacy top-level paths → new section routes (keep old links working).
  { path: 'agent-creation', pathMatch: 'full', redirectTo: 'agent-hub/agents' },
  { path: 'knowledge-base', pathMatch: 'full', redirectTo: 'agent-resources/knowledge-base' },
  { path: 'tool-registry', pathMatch: 'full', redirectTo: 'agent-resources/tool-registry' },
  { path: 'skill-registry', pathMatch: 'full', redirectTo: 'agent-resources/skill-registry' },
  { path: 'evaluation-logs', pathMatch: 'full', redirectTo: 'agent-resources/agent-evals' },

  // Shared shell: product nav + per-section sub-tabs + CTA wrap every section.
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'agent-hub/agents' },

      { path: 'agent-hub', pathMatch: 'full', redirectTo: 'agent-hub/agents' },
      { path: 'agent-hub/agents', component: AgentCreationListComponent },
      { path: 'agent-hub/projects', component: AgentProjectsListComponent },
      { path: 'agent-hub/projects/:projectId', component: AgentProjectDetailComponent },
      { path: 'agent-hub/agentic-flows', component: AgenticFlowsComponent },

      { path: 'agent-resources', pathMatch: 'full', redirectTo: 'agent-resources/tool-registry' },
      { path: 'agent-resources/tool-registry', component: ToolRegistryComponent },
      { path: 'agent-resources/skill-registry', component: SkillRegistryComponent },
      { path: 'agent-resources/knowledge-base', component: KnowledgeBaseComponent },
      { path: 'agent-resources/agent-evals', component: PlaceholderPageComponent, data: { title: 'Agent Evals' } },

      { path: 'monitoring-hub', pathMatch: 'full', redirectTo: 'monitoring-hub/agent-executions' },
      { path: 'monitoring-hub/agent-executions', component: PlaceholderPageComponent, data: { title: 'Agent Executions' } },

      { path: 'credentials', pathMatch: 'full', redirectTo: 'credentials/llm-configs' },
      { path: 'credentials/llm-configs', component: PlaceholderPageComponent, data: { title: 'LLM Configs' } },
      { path: 'credentials/app-credentials', component: PlaceholderPageComponent, data: { title: 'App Credentials' } },
    ],
  },

  { path: '**', redirectTo: '' },
];
