import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { AuthService } from '../auth/auth.service';
import { takeUntil, Subject } from 'rxjs';
import { UserRole } from '../interfaces/user-role';
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
  //Keep track of users auth status
  public isLoggedIn: boolean = false;
  //To remove auth status subscritption
  private destroySubject = new Subject();
  //Reference to current user's role
  userRole = '';

  constructor(private authService: AuthService, private router:Router, private http:HttpClient) {
    //Get Auth Status
    authService.authStatus.pipe(takeUntil(this.destroySubject)).subscribe(
      res => {
        //Track if user is logged in
        this.isLoggedIn = res;
        //Retrieve user roles
        this.getUserRoles();
      });
  }

  logout() {
    //Call auth services logout method
    this.authService.logout();
    //Navigate to Root
    this.router.navigate(["/"]);
  }

  ngOnInit(): void{
    //Check if user is authenticated
    this.isLoggedIn = this.authService.isAuthenticated();
    // this.getUserRoles();
  }

  ngOnDestroy(): void {
    //Unsubscribes from ovservable
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  getUserRoles() {
    //Fetches current user's role so navbar can navigate to the appropriate dashboard
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
