import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './knowledge-base.component.html',
  styleUrl: './knowledge-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgeBaseComponent {}
