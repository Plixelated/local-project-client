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
    //Set Page Title
    titleService.setTitle(this.title);
    //Check if a local originID exists
    const localOriginID = localStorage.getItem("DESubToken");
    //If not assign one using a UUID
    if (!localOriginID) {
      const originID = uuidv4();
      localStorage.setItem("DESubToken", originID);
    }
  }
}
