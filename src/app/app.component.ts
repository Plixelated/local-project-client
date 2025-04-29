import { Component, Input } from '@angular/core';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { InputWrapperComponent } from './input-wrapper/input-wrapper.component';
import { UUIDTypes, v4 as uuidv4 } from 'uuid';

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

  constructor() {
    const localToken = localStorage.getItem("DESubToken");
    if (!localToken) {
      const submission_token = uuidv4();
      localStorage.setItem("DESubToken", submission_token);
    }
  }
}
