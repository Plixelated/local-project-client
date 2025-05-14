import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from './login-request';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OriginID } from '../origin-id';
import { throwError } from 'rxjs';

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

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    //Initialize Form
    this.form = new FormGroup({
      userName: new FormControl("", Validators.required), //Makes fom required
      password: new FormControl("", Validators.required) //Makes fom required
    });
  }

  onSubmit() {
    let loginRequest = <LoginRequest>{
      userName: this.form.controls['userName'].value,
      password: this.form.controls['password'].value
    };

    this.authService.login(loginRequest).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(["/"]);
          this.updateOriginToken();
        }
      },
      error: (e) => console.error(e)
    });
  };

  updateOriginToken() {
    //Get Local OriginID
    const localOriginID = localStorage.getItem("DESubToken");
    //If Local OriginID Exists overwrite it with saved token
    let url = `${environment.baseURL}api/Admin/GetUserOriginID`;
    this.http.get<OriginID>(url).subscribe({
      next: (res) => {
        let originID: OriginID = res;
        localStorage.setItem("DESubToken", originID.entryOrigin);
      },
      error: (e => {
        if (e instanceof HttpErrorResponse && e.status === 400) {
          //ADD LOGIC TO FIX BROKEN CONNECTION
          console.log("No Remote Token");
          throwError(() => e);
        }
      })
    });
  }
}