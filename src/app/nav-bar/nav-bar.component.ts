import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../auth/auth.service';
import { takeUntil, Subject } from 'rxjs';
import { UserRole } from '../user-role';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {
  public isLoggedIn: boolean = false;
  private destroySubject = new Subject();
  userRole = '';

  constructor(private authService: AuthService, private router:Router, private http:HttpClient) {
    authService.authStatus.pipe(takeUntil(this.destroySubject)).subscribe(
      res => {
        this.isLoggedIn = res;
        this.getUserRoles();
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  ngOnInit(): void{
    this.isLoggedIn = this.authService.isAuthenticated();
    this.getUserRoles();
    console.log(this.isLoggedIn);
  }

  ngOnDestroy(): void {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

    getUserRoles() {
      let fetchedRole: UserRole[] = []
      let url = `${environment.baseURL}api/Admin/GetUserRole`;
      this.http.get<UserRole[]>(url).subscribe({
        next: (res) => {
          fetchedRole = res;
          if (fetchedRole.length > 0){
            this.userRole = fetchedRole[0].value;
            console.log(this.userRole);
          }
        },
        error: (e) => console.error(e)
      });
    }

}
