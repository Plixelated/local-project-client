import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InputSliderComponent } from "../input-slider/input-slider.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../auth/auth.service';
import { takeUntil, Subject } from 'rxjs';



@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    MatIconModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  public isLoggedIn: boolean = false;
  private destroySubject = new Subject();

  constructor(private authService: AuthService, private router:Router) {
    authService.authStatus.pipe(takeUntil(this.destroySubject)).subscribe(
      res => {
        this.isLoggedIn = res;
        console.log(this.isLoggedIn);
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

}
