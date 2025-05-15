import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from './login-request';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OriginID } from '../interfaces/origin-id';
import { throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup; //Will be defined
  //DI
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    //Initialize Form
    this.form = new FormGroup({
      userName: new FormControl("", Validators.required), //Makes fom required
      password: new FormControl("", Validators.required) //Makes fom required
    });
  }
  //When User Logs in
  onSubmit() {
    //Create Login Request Object
    let loginRequest = <LoginRequest>{
      userName: this.form.controls['userName'].value,
      password: this.form.controls['password'].value
    };
    //Subscribe to authService login observable
    this.authService.login(loginRequest).subscribe({
      next: (res) => {
        //if successful
        if (res.success) {
          //Reroute to root
          this.router.navigate(["/"]);
          //Update the OriginID Token
          this.updateOriginToken();
        }
      },
      error: (e) => console.error(e)
    });
  };

  //Updates Users OriginID to remote value
  updateOriginToken() {
    //Get Local OriginID
    const localOriginID = localStorage.getItem("OriginID");
    //If Local OriginID Exists overwrite it with saved token
    let url = `${environment.baseURL}api/Admin/GetUserOriginID`;
    //Retrieve Remote Token
    this.http.get<OriginID>(url).subscribe({
      next: (res) => {
        //stores remote origin ID
        let originID: OriginID = res;
        //Overwrites local token
        localStorage.setItem("OriginID", originID.entryOrigin);
      },
      error: (e => {
        if (e instanceof HttpErrorResponse && e.status === 400) {
          //If no remote token exists

          //Create a new local token
          const originID = uuidv4();
          //Store in local storage
          localStorage.setItem("OriginID", originID);
          //Create link in database with new token
          this.setUserOriginID();

          console.log("Updated Remote Token");
          throwError(() => e);
        }
      })
    });
  }
  //Sets users remote OriginID if it doesn't currently exist
  setUserOriginID(){
    let originID = localStorage.getItem("OriginID");
    let url = `${environment.baseURL}api/Admin/SetUserOriginID/${originID}`;
    this.http.post(url, {}).subscribe({
      next: (res) => console.log(res),
      error: (e) => console.error(e)
    });
  }
}