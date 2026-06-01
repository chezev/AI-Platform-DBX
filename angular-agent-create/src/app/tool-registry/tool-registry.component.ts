import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tool-registry',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tool-registry.component.html',
  styleUrl: './tool-registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolRegistryComponent {}
