import { Component, Input } from '@angular/core';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { InputWrapperComponent } from './input-wrapper/input-wrapper.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    NavBarComponent,
    RouterOutlet,
    InputWrapperComponent,
]
})
export class AppComponent {
  title = 'project-client';
}
