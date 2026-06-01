import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-flow-builder',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './flow-builder.component.html',
  styleUrl: './flow-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowBuilderComponent {
  readonly canvasStudioUrl = 'http://localhost:5173';
}
