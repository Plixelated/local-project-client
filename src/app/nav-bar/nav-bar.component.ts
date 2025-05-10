import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
export class NavBarComponent implements OnInit, OnDestroy {
  public isLoggedIn: boolean = false;
  private destroySubject = new Subject();

  constructor(private authService: AuthService, private router:Router) {
    authService.authStatus.pipe(takeUntil(this.destroySubject)).subscribe(
      res => {
        this.isLoggedIn = res;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  ngOnInit(): void{
    this.isLoggedIn = this.authService.isAuthenticated();
    console.log(this.isLoggedIn);
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

}
