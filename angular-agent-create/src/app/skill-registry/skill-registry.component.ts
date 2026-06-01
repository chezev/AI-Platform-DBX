import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-skill-registry',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './skill-registry.component.html',
  styleUrl: './skill-registry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillRegistryComponent {}
