import { Routes } from '@angular/router';
import { AgentCreateScreenComponent } from './agent-create-screen/agent-create-screen.component';
import { AgentCreationListComponent } from './agent-creation-list/agent-creation-list.component';
import { AgentStartupPlaceholderComponent } from './agent-startup-placeholder/agent-startup-placeholder.component';
import { AgentTestScreenComponent } from './agent-test-screen/agent-test-screen.component';
import { AgentTemplateDetailComponent } from './agent-template-detail/agent-template-detail.component';
import { ComponentLibraryComponent } from './component-library/component-library.component';
import { EvaluationLogsComponent } from './evaluation-logs/evaluation-logs.component';
import { ExamplePagesComponent } from './example-pages/example-pages.component';
import { FlowBuilderComponent } from './flow-builder/flow-builder.component';
import { FormsReferenceComponent } from './forms-reference/forms-reference.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { SkillRegistryComponent } from './skill-registry/skill-registry.component';
import { ToolRegistryComponent } from './tool-registry/tool-registry.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'agent-creation',
    pathMatch: 'full',
  },
  {
    path: 'flowbuilder',
    component: FlowBuilderComponent,
  },
  {
    path: 'components',
    component: ComponentLibraryComponent,
  },
  {
    path: 'forms',
    component: FormsReferenceComponent,
  },
  {
    path: 'examples',
    component: ExamplePagesComponent,
  },
  {
    path: 'knowledge-base',
    component: KnowledgeBaseComponent,
  },
  {
    path: 'tool-registry',
    component: ToolRegistryComponent,
  },
  {
    path: 'skill-registry',
    component: SkillRegistryComponent,
  },
  {
    path: 'agent-creation',
    component: AgentCreationListComponent,
  },
  {
    path: 'agent-creation/startup',
    component: AgentStartupPlaceholderComponent,
  },
  {
    path: 'agent-creation/template/:templateId',
    component: AgentTemplateDetailComponent,
  },
  {
    path: 'agent-creation/create',
    component: AgentCreateScreenComponent,
  },
  {
    path: 'agent-creation/test',
    component: AgentTestScreenComponent,
  },
  {
    path: 'evaluation-logs',
    component: EvaluationLogsComponent,
  },
  {
    path: '**',
    redirectTo: 'agent-creation',
    pathMatch: 'full',
  },
];
