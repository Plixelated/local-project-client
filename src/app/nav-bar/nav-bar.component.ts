import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputSliderComponent } from "../input-slider/input-slider.component";

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, InputSliderComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

}
