import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evaluation-logs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './evaluation-logs.component.html',
  styleUrl: './evaluation-logs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationLogsComponent {}
