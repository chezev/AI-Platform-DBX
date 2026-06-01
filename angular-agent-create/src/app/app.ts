import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SdsToastComponent } from './shared/toast/sds-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SdsToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
