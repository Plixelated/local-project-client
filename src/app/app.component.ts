import { Component, Input } from '@angular/core';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { RouterOutlet } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    NavBarComponent,
    RouterOutlet
  ]
})
export class AppComponent {
  title:string = 'The Drake Equation';

  constructor(private titleService: Title) {
    titleService.setTitle(this.title);
    const localToken = localStorage.getItem("DESubToken");
    if (!localToken) {
      const submission_token = uuidv4();
      localStorage.setItem("DESubToken", submission_token);
    }
  }
}
