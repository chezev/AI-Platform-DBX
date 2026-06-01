import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProductArea {
  title: string;
  description: string;
  path: string;
  stack: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly areas: ProductArea[] = [
    {
      title: 'Flowbuilder',
      description: 'Visual agent workflow canvas powered by React Flow.',
      path: '/flowbuilder',
      stack: 'React Flow integration',
    },
    {
      title: 'Knowledge Base',
      description: 'Knowledge ingestion, indexing, and retrieval management.',
      path: '/knowledge-base',
      stack: 'Angular',
    },
    {
      title: 'Tool Registry',
      description: 'Central catalog of callable tools and connectors.',
      path: '/tool-registry',
      stack: 'Angular',
    },
    {
      title: 'Skill Registry',
      description: 'Skill templates, rules, and lifecycle governance.',
      path: '/skill-registry',
      stack: 'Angular',
    },
    {
      title: 'Agent Creation',
      description: 'End-to-end configuration of AI agents and capabilities.',
      path: '/agent-creation',
      stack: 'Angular',
    },
    {
      title: 'Evaluation Logs',
      description: 'Trace, monitor, and audit agent decisions and outputs.',
      path: '/evaluation-logs',
      stack: 'Angular',
    },
  ];

  trackByPath(index: number, area: ProductArea): string {
    return `${index}-${area.path}`;
  }
}
