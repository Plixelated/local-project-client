import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputSliderComponent } from "../input-slider/input-slider.component";
import { AuthService } from '../auth/auth.service';
import { takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  public isLoggedIn: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private authService:AuthService){
    authService.authStatus.pipe(takeUntil(this.destroy$)).subscribe(
      res =>{
        this.isLoggedIn = res;
    });
  }

  logout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
